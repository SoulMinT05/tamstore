import { Link } from 'react-router-dom';
import './Footer.css';
function FooterComponent() {
    return (
        <div className="footer">
            <div className="sb__footer section__padding">
                <div className="sb__footer-links">
                    {/* <div className="sb__footer-links_div">
                        <h4>For Business</h4>
                        <Link>
                            <p>Employer</p>
                        </Link>
                        <Link>
                            <p>Employer</p>
                        </Link>
                        <Link>
                            <p>Employer</p>
                        </Link>
                    </div> */}
                    {/* <div className="sb__footer-links_div">
                        <h4>Resources</h4>
                        <Link>
                            <p>Employer</p>
                        </Link>
                        <Link>
                            <p>Employer</p>
                        </Link>
                        <Link>
                            <p>Employer</p>
                        </Link>
                    </div> */}
                    <div className="sb__footer-links_div">
                        <h4>Contact</h4>
                        <Link>
                            <p className="contact-info">
                                <i className="ri-map-pin-line contact-info__icon"></i>
                                <h6>Location: Can Tho, Viet Nam</h6>
                            </p>
                            <p className="contact-info">
                                <i className="ri-phone-line contact-info__icon"></i>
                                <h6>Phone: 0123274821</h6>
                            </p>
                            <p className="contact-info">
                                <i className="ri-mail-line contact-info__icon"></i>
                                <h6>Email: contact@gmail.com</h6>
                            </p>
                        </Link>
                    </div>
                    <div className="sb__footer-links_div">
                        <h4>Customer Care</h4>
                        <Link to="/sign-up">
                            <p>Register</p>
                        </Link>
                        <Link to="/sign-in">
                            <p>Login</p>
                        </Link>
                        <Link to="/">
                            <p>Home</p>
                        </Link>
                    </div>
                    <div className="sb__footer-links_div">
                        <h4>Follow</h4>
                        <div className="socialmedia">
                            <p>
                                <a href="https://www.facebook.com/tamng.05/">
                                    <i className="ri-facebook-fill"></i>
                                </a>
                            </p>
                            <p>
                                <a href="https://github.com/SoulMinT05">
                                    <i className="ri-github-fill"></i>
                                </a>
                            </p>
                            <p>
                                <a href="#">
                                    <i className="ri-linkedin-fill"></i>
                                </a>
                            </p>
                            <p>
                                <a href="#">
                                    <i className="ri-youtube-fill"></i>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="sb__footer-below">
                    <div className="sb__footer-copyright">
                        <p>@{new Date().getFullYear()} Tam Nguyen. All right reserved</p>
                    </div>
                    <div className="sb__footer-below-links">
                        <a href="#">
                            <div>
                                <p>Terms & Conditions</p>
                            </div>
                        </a>
                        <a href="#">
                            <div>
                                <p>Privacy</p>
                            </div>
                        </a>
                        <a href="#">
                            <div>
                                <p>Security</p>
                            </div>
                        </a>
                        <a href="#">
                            <div>
                                <p>Cookie Declaration</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FooterComponent;
