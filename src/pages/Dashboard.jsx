import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Empty,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
  theme,
} from "antd";
import {
  DeleteOutlined,
  LockOutlined,
  LogoutOutlined,
  MailOutlined,
  ReloadOutlined,
  ScissorOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  auth,
  firebaseConfigFields,
  isFirebaseConfigured,
} from "../lib/firebase";
import { subscribeToBookings } from "../lib/bookings";
import {
  createBarber,
  DEFAULT_BARBER_IMAGE,
  removeBarber,
  subscribeToBarbers,
} from "../lib/barbers";

const { Title, Text } = Typography;

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function FirebaseSetupNotice() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center">
        <Card className="w-full border-white/10 bg-[#111111] shadow-2xl">
          <Space direction="vertical" size="large" className="w-full">
            <div>
              <Title level={2} className="!mb-2 !text-white">
                Dashboard setup
              </Title>
              <Text className="!text-white/60">
                Add your Firebase project values before using the booking
                dashboard.
              </Text>
            </div>
            <Alert
              type="warning"
              showIcon
              message="Firebase is not configured"
              description={`Create a .env file and add: ${firebaseConfigFields.join(", ")}.`}
            />
          </Space>
        </Card>
      </div>
    </div>
  );
}

function LoginView() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      form.resetFields();
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <Card className="w-full border-white/10 bg-[#111111] shadow-2xl">
          <Space direction="vertical" size="large" className="w-full">
            <div>
              <Title level={2} className="!mb-2 !text-white">
                Culture Barbershop
              </Title>
              <Text className="!text-white/60">Log in</Text>
            </div>

            {error && (
              <Alert
                type="error"
                showIcon
                message="Login failed"
                description={error}
              />
            )}

            <Form form={form} layout="vertical" onFinish={handleLogin}>
              <Form.Item
                label={<span className="text-white/70">Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-white/70">Password</span>}
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
              >
                Log in
              </Button>
            </Form>
          </Space>
        </Card>
      </div>
    </div>
  );
}

function DashboardView({ user }) {
  const [barberForm] = Form.useForm();
  const [bookings, setBookings] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [barbersLoading, setBarbersLoading] = useState(true);
  const [savingBarber, setSavingBarber] = useState(false);
  const [removingBarberId, setRemovingBarberId] = useState("");
  const [error, setError] = useState("");
  const [barbersError, setBarbersError] = useState("");

  useEffect(() => {
    setLoading(true);

    return subscribeToBookings(
      (nextBookings) => {
        setBookings(nextBookings);
        setLoading(false);
      },
      (bookingError) => {
        setError(bookingError.message);
        setLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    setBarbersLoading(true);

    return subscribeToBarbers(
      (nextBarbers) => {
        setBarbers(nextBarbers);
        setBarbersLoading(false);
      },
      (barberError) => {
        setBarbersError(barberError.message);
        setBarbersLoading(false);
      },
    );
  }, []);

  const handleAddBarber = async (values) => {
    const name = values.name.trim();

    if (!name) {
      setBarbersError("Barber name is required.");
      return;
    }

    const duplicate = barbers.some(
      (barber) => barber.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicate) {
      setBarbersError("A barber with this name already exists.");
      return;
    }

    setSavingBarber(true);
    setBarbersError("");

    try {
      await createBarber({
        name,
        role: values.role,
        img: values.img,
      });
      barberForm.resetFields();
    } catch (barberError) {
      setBarbersError(barberError.message);
    } finally {
      setSavingBarber(false);
    }
  };

  const handleRemoveBarber = async (barberId) => {
    setRemovingBarberId(barberId);
    setBarbersError("");

    try {
      await removeBarber(barberId);
    } catch (barberError) {
      setBarbersError(barberError.message);
    } finally {
      setRemovingBarberId("");
    }
  };

  const rows = useMemo(
    () =>
      bookings.flatMap((booking) =>
        (booking.people || []).map((person, index) => ({
          key: `${booking.id}-${index}`,
          bookingId: booking.id,
          personNumber: index + 1,
          groupSize: booking.groupSize || booking.people?.length || 1,
          isGroup: booking.isGroup,
          phone: booking.phone,
          createdAt: booking.createdAt,
          firstName: person.firstName,
          lastName: person.lastName,
          name: `${person.firstName} ${person.lastName}`.trim(),
          barber: person.barber,
          service: person.service,
          datetime: person.datetime,
        })),
      ),
    [bookings],
  );

  const columns = [
    {
      title: "Client",
      dataIndex: "name",
      key: "name",
      render: (name, row) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name || "-"}</Text>
          {row.isGroup && (
            <Text type="secondary">Person {row.personNumber}</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Barber",
      dataIndex: "barber",
      key: "barber",
    },
    {
      title: "Appointment",
      dataIndex: "datetime",
      key: "datetime",
      render: formatDateTime,
      sorter: (a, b) => new Date(a.datetime) - new Date(b.datetime),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Booking",
      key: "bookingType",
      render: (_, row) =>
        row.isGroup ? (
          <Tag color="gold">Group of {row.groupSize}</Tag>
        ) : (
          <Tag>Single</Tag>
        ),
      filters: [
        { text: "Single", value: "single" },
        { text: "Group", value: "group" },
      ],
      onFilter: (value, row) =>
        value === "group" ? row.isGroup : !row.isGroup,
    },
    {
      title: "Received",
      dataIndex: "createdAt",
      key: "createdAt",
      render: formatDateTime,
    },
  ];

  const barberColumns = [
    {
      title: "Barber",
      dataIndex: "name",
      key: "name",
      render: (_, barber) => (
        <Space>
          <Avatar size={44} src={barber.img || DEFAULT_BARBER_IMAGE} />
          <Space direction="vertical" size={0}>
            <Text strong>{barber.name}</Text>
            <Text type="secondary">{barber.role}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Image URL",
      dataIndex: "img",
      key: "img",
      ellipsis: true,
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, barber) => (
        <Popconfirm
          title="Remove barber?"
          description={`${barber.name} will disappear from the website and booking form.`}
          okText="Remove"
          okButtonProps={{ danger: true }}
          onConfirm={() => handleRemoveBarber(barber.id)}
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={removingBarberId === barber.id}
          >
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-5 py-6 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Title level={2} className="!mb-1 !text-white">
              Bookings
            </Title>
            <Text className="!text-white/55">Logged in as {user.email}</Text>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={() => signOut(auth)}
            >
              Log out
            </Button>
          </Space>
        </div>

        {error && (
          <Alert
            className="mb-5"
            type="error"
            showIcon
            message="Could not load bookings"
            description={error}
          />
        )}

        <Row gutter={[16, 16]} className="mb-5">
          <Col xs={24} md={8}>
            <Card>
              <Statistic title="Bookings" value={bookings.length} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic title="People" value={rows.length} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Group bookings"
                value={bookings.filter((booking) => booking.isGroup).length}
              />
            </Card>
          </Col>
        </Row>

        <Card
          className="mb-5"
          title={
            <Space>
              <ScissorOutlined />
              <span>Barbers</span>
            </Space>
          }
          extra={<Text type="secondary">Website and booking form</Text>}
        >
          {barbersError && (
            <Alert
              className="mb-5"
              type="error"
              showIcon
              message="Could not update barbers"
              description={barbersError}
            />
          )}

          <Form form={barberForm} layout="vertical" onFinish={handleAddBarber}>
            <Row gutter={[16, 0]} align="bottom">
              <Col xs={24} lg={7}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Name is required",
                    },
                  ]}
                >
                  <Input placeholder="Name Surname" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={5}>
                <Form.Item label="Role" name="role" initialValue="Barber">
                  <Input placeholder="Barber" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item label="Image URL" name="img">
                  <Input placeholder={DEFAULT_BARBER_IMAGE} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={4}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<UserAddOutlined />}
                    loading={savingBarber}
                    block
                  >
                    Add
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Table
            rowKey="id"
            columns={barberColumns}
            dataSource={barbers}
            loading={barbersLoading}
            locale={{
              emptyText: <Empty description="No barbers yet" />,
            }}
            pagination={false}
            scroll={{ x: 760 }}
          />
        </Card>

        <Card>
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={rows}
              locale={{
                emptyText: <Empty description="No bookings yet" />,
              }}
              pagination={{ pageSize: 10, showSizeChanger: true }}
              scroll={{ x: 1000 }}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!auth) {
      setCheckingAuth(false);
      return undefined;
    }

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
  }, []);

  if (!isFirebaseConfigured) return <FirebaseSetupNotice />;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#ffffff",
          colorInfo: "#c9a84c",
          borderRadius: 8,
          colorBgBase: "#0a0a0a",
          colorBgContainer: "#111111",
        },
      }}
    >
      {checkingAuth ? (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <Spin size="large" />
        </div>
      ) : user ? (
        <DashboardView user={user} />
      ) : (
        <LoginView />
      )}
    </ConfigProvider>
  );
}
