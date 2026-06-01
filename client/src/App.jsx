import { Navigate, Route, Routes } from 'react-router-dom';
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx';
import AdminAccess from './pages/AdminAccess.jsx';
import AdminClubDashboard from './pages/AdminClubDashboard.jsx';
import AdminMemberProfile from './pages/AdminMemberProfile.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import MemberDashboard from './pages/MemberDashboard.jsx';
import Register from './pages/Register.jsx';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route
        path="/member"
        element={
          <RoleProtectedRoute allowedRoles={['MEMBER']}>
            <MemberDashboard />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={['ADMIN']} redirectTo="/admin">
            <AdminClubDashboard />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/members/:memberId"
        element={
          <RoleProtectedRoute allowedRoles={['ADMIN']} redirectTo="/admin">
            <AdminMemberProfile />
          </RoleProtectedRoute>
        }
      />
      <Route path="/admin" element={<AdminAccess />} />
      <Route path="/admin-club-secreto" element={<Navigate replace to="/admin" />} />
      <Route path="/admin-club-secreto/miembros/:memberId" element={<Navigate replace to="/admin" />} />
    </Routes>
  );
}

export default App;
