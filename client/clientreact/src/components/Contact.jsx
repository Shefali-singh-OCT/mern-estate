import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Contact(list) {
  const [landlord, setLandlord] = useState(null);
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = fetch(
          `http://localhost:3000/api/user/getUserListing/${list.list.userRef}`,
          {
            method: "GET",
          }
        );
        const data = (await response).json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setLandlord(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchDetails();
  }, [list.list.userRef]);
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-3">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">
              {list.list.name.toLowerCase()}
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={() => setMessage(e.target.value)}
            placeholder="Enter Your message here...."
            className="w-full border p-3 rounded-lg"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${list.list.name} & body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-85"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}

export default Contact;
