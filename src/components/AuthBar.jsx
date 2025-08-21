import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/authSlice';
import { Button } from '@/components/ui/button';

/**
 * Navigation auth controls: shows user email and Logout, or Login button.
 * @returns {JSX.Element}
 */
function AuthBar() {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <span className="text-sm text-slate-600 hidden sm:inline">{user.email}  {user.role === "admin" && "(admin)"}</span>
          <Button
            onClick={() => dispatch(logout())}
            variant="outline" size="md"
          >Logout</Button>
        </>
      ) : (
        <Button
          onClick={() => navigate('/login') }
          variant="outline" size="md"
        >Login</Button>
      )}
    </div>
  );
}
export default AuthBar;