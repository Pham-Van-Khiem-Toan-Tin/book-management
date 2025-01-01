import { Link } from "react-router";
import "./error-403.css";

const Error403 = () => {
  return (
    <div className="error-page-403">
      <div className="error-page-403-container">
        <div>403</div>
        <div className="txt">
          Không được phép truy cập<span className="blink">_</span>
        </div>
        <Link to="/" className="fs-3 mt-2">Trang chủ</Link>
      </div>
    </div>
  )
}

export default Error403