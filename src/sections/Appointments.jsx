import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Users } from "lucide-react";
import { createBooking } from "../lib/bookings";
import { subscribeToBarbers } from "../lib/barbers";

const services = ["Haircut", "Shave", "Grooming"];
const groupSizes = [2, 3, 4, 5, 6];

const emptyPerson = {
  firstName: "",
  lastName: "",
  barber: "",
  service: "",
  datetime: "",
};

const fieldClassName = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5
  text-white text-sm placeholder-white/25
  focus:outline-none focus:border-white/30 focus:bg-white/8
  transition-all duration-200`;

const selectClassName = `w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3.5
  text-white/80 text-sm
  focus:outline-none focus:border-white/30
  transition-all duration-200`;

export default function Appointments() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [phone, setPhone] = useState("");
  const [people, setPeople] = useState([{ ...emptyPerson }]);
  const [savedBooking, setSavedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [barbers, setBarbers] = useState([]);
  const [barbersLoading, setBarbersLoading] = useState(true);

  const visiblePeople = isGroup ? people : people.slice(0, 1);

  useEffect(() => {
    return subscribeToBarbers(
      (nextBarbers) => {
        setBarbers(nextBarbers);
        setBarbersLoading(false);
      },
      () => setBarbersLoading(false),
    );
  }, []);

  const updatePerson = (index, field, value) => {
    setPeople((currentPeople) =>
      currentPeople.map((person, personIndex) =>
        personIndex === index ? { ...person, [field]: value } : person,
      ),
    );
  };

  const handleGroupToggle = (checked) => {
    setIsGroup(checked);

    if (checked && people.length < 2) {
      setPeople((currentPeople) => [...currentPeople, { ...emptyPerson }]);
    }
  };

  const handlePersonCountChange = (count) => {
    setPeople((currentPeople) => {
      if (count > currentPeople.length) {
        return [
          ...currentPeople,
          ...Array.from({ length: count - currentPeople.length }, () => ({
            ...emptyPerson,
          })),
        ];
      }

      return currentPeople.slice(0, count);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (barbersLoading || barbers.length === 0) {
      setSubmitError("No barbers are available right now.");
      return;
    }

    setSubmitting(true);

    const bookedPeople = visiblePeople.map((person) => ({ ...person }));

    try {
      const booking = await createBooking({
        phone,
        isGroup,
        people: bookedPeople,
      });

      setSavedBooking(booking);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="appointments" className="py-24 lg:py-32 bg-black">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2
            className="text-[2.5rem] lg:text-[3.2rem] font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Book an Appointment
          </h2>
          <p className="text-white/50 text-base lg:text-lg">
            Reserve your spot with one of our expert barbers today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="service-card rounded-2xl p-8 lg:p-12"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-white/60 text-xs mb-2 tracking-widest uppercase">
                Contact Phone
              </label>
              <input
                type="tel"
                placeholder="+389 00 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={fieldClassName}
              />
            </div>

            <label className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 cursor-pointer transition-colors hover:border-white/20">
              <input
                type="checkbox"
                checked={isGroup}
                onChange={(e) => handleGroupToggle(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 accent-white"
              />
              <span className="flex flex-1 items-start gap-3">
                <span className="mt-0.5 text-white/70">
                  <Users size={18} strokeWidth={1.8} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    We are a group
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-white/45">
                    Book more than one person with separate service details.
                  </span>
                </span>
              </span>
            </label>

            {isGroup && (
              <div>
                <label className="block text-white/60 text-xs mb-2 tracking-widest uppercase">
                  Number Of Persons
                </label>
                <div className="relative">
                  <select
                    value={people.length}
                    onChange={(e) =>
                      handlePersonCountChange(Number(e.target.value))
                    }
                    className={selectClassName}
                  >
                    {groupSizes.map((size) => (
                      <option key={size} value={size} className="bg-black">
                        {size} persons
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-5">
              {visiblePeople.map((person, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 lg:p-6"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                      {isGroup ? `Person ${index + 1}` : "Appointment Details"}
                    </h3>
                    {isGroup && (
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45">
                        #{index + 1}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-white/60 text-xs mb-2 tracking-widest uppercase">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        value={person.firstName}
                        onChange={(e) =>
                          updatePerson(index, "firstName", e.target.value)
                        }
                        required
                        className={fieldClassName}
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-2 tracking-widest uppercase">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={person.lastName}
                        onChange={(e) =>
                          updatePerson(index, "lastName", e.target.value)
                        }
                        required
                        className={fieldClassName}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="block text-white/60 text-xs mb-2 tracking-widest uppercase">
                      Select Barber
                    </label>
                    <div className="relative">
                      <select
                        value={person.barber}
                        onChange={(e) =>
                          updatePerson(index, "barber", e.target.value)
                        }
                        required
                        disabled={barbersLoading || barbers.length === 0}
                        className={selectClassName}
                      >
                        <option value="" className="bg-black">
                          {barbersLoading
                            ? "Loading barbers..."
                            : barbers.length
                            ? "Choose a barber"
                            : "No barbers available"}
                        </option>
                        {barbers.map((barber) => (
                          <option
                            key={barber.id || barber.name}
                            value={barber.name}
                            className="bg-black"
                          >
                            {barber.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="block text-white/60 text-xs mb-2 tracking-widest uppercase">
                      Service
                    </label>
                    <div className="relative">
                      <select
                        value={person.service}
                        onChange={(e) =>
                          updatePerson(index, "service", e.target.value)
                        }
                        required
                        className={selectClassName}
                      >
                        <option value="" className="bg-black">
                          Choose a service
                        </option>
                        {services.map((service) => (
                          <option
                            key={service}
                            value={service}
                            className="bg-black"
                          >
                            {service}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="block text-white/60 text-xs mb-2 tracking-widest uppercase">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={person.datetime}
                      onChange={(e) =>
                        updatePerson(index, "datetime", e.target.value)
                      }
                      required
                      className={fieldClassName}
                    />
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              type="submit"
              disabled={submitting || barbersLoading || barbers.length === 0}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(255,255,255,0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 btn-primary w-full py-4 rounded-xl text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving Booking..."
                : submitted
                ? `✓ ${visiblePeople.length > 1 ? "Group Booking Saved!" : "Appointment Booked!"}`
                : `Confirm ${visiblePeople.length > 1 ? "Group Booking" : "Booking"}`}
            </motion.button>

            {submitError && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
                {submitError}
              </div>
            )}

            {savedBooking && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">
                  Latest saved booking: {savedBooking.people.length}{" "}
                  {savedBooking.people.length > 1 ? "people" : "person"}
                </p>
                <div className="mt-3 grid gap-2">
                  {savedBooking.people.map((person, index) => (
                    <p
                      key={`${person.firstName}-${person.datetime}-${index}`}
                      className="text-xs leading-relaxed text-white/50"
                    >
                      {index + 1}. {person.firstName} {person.lastName} -{" "}
                      {person.service} with {person.barber}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
