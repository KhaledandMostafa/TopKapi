export default function Contact() {
  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>
          We’re here to help! If you have any questions or need technical
          support, feel free to get in touch with us. You can contact one of our
          team members, whether you have inquiries related to Front-End or
          Back-End. Below are the contact details for both:
        </p>
      </header>

      <div className="team-container">
        <div className="team-member">
          <h2>Mostafa Ahmed</h2>
          <p>
            Role: Front-End Developer <br />
            Description: Mostafa is responsible for designing and developing
            attractive and user-friendly interfaces. With his expertise in HTML,
            CSS, JavaScript, and frameworks like React and Next js, Mostafa will
            assist you with anything related to the user experience.
          </p>
          <h3>Contact Information:</h3>
          <ul>
            <a href="https://github.com/mostafa0x" target="_blank">
              <li>Github Click me</li>
            </a>
          </ul>
        </div>

        <div className="team-member">
          <h2>Khaled Amr</h2>
          <p>
            Role: Back-End Developer <br />
            Description: Khaled is responsible for building the systems that
            work behind the scenes, such as databases, servers, and APIs. With
            extensive experience in back-end development using technologies like
            Node.js, PHP, and Python, Khaled ensures strong, scalable, and
            secure performance.
          </p>
          <h3>Contact Information:</h3>
          <ul>
            <a
              href="https://github.com/Khaled-Amr-1?tab=overview&from=2024-12-01&to=2024-12-31"
              target="_blank"
            >
              <li>Github Click me</li>
            </a>
          </ul>
        </div>
      </div>

      <div className="location">
        <h3>Our Location</h3>
        <p>If you would like to visit our office, here’s the address:</p>
        <p>Address: ElMoatm, Cairo, Egypt</p>
      </div>
    </div>
  );
}
