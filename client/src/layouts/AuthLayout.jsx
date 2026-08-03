import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <h1>Instagram Clone</h1>

        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
