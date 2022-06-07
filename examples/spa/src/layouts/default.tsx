import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';

export default function DefaultLayout() {
  return (
    <div>
      <div>
        <Link to='/' style={{ marginRight: 8 }}>Home</Link>
        <Link to='/sub'>Sub</Link>
      </div>
      <Outlet />
    </div>
  );
}
