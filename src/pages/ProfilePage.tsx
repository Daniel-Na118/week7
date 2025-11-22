import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

interface ProfileData {
  enrollYear: number;
  department: string;
  cvKey: string;
}

const ProfilePage = () => {
  const [enrollYear, setEnrollYear] = useState('');
  const [departments, setDepartments] = useState<string[]>(['']);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/api/applicant/me');
        const data: ProfileData = response.data;
        setEnrollYear(data.enrollYear.toString());
        setDepartments(data.department.split(','));
        setCvFileName(data.cvKey.split('/').pop() || null);
      } catch (error: any) {
        if (error.response && error.response.data.code === 'APPLICANT_002') {
          // Profile does not exist, so we are creating a new one
        } else {
          console.error('Failed to fetch profile:', error);
          setError('Failed to load profile data.');
        }
      }
    };
    fetchProfile();
  }, []);

  const handleDepartmentChange = (index: number, value: string) => {
    const newDepartments = [...departments];
    newDepartments[index] = value;
    setDepartments(newDepartments);
  };

  const addDepartment = () => {
    if (departments.length < 7) {
      setDepartments([...departments, '']);
    }
  };

  const removeDepartment = (index: number) => {
    if (departments.length > 1) {
      const newDepartments = [...departments];
      newDepartments.splice(index, 1);
      setDepartments(newDepartments);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed for CV.');
        setCvFile(null);
        setCvFileName(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('CV file size cannot exceed 5MB.');
        setCvFile(null);
        setCvFileName(null);
        return;
      }
      setCvFile(file);
      setCvFileName(file.name);
      setError('');
    }
  };

  const validateForm = () => {
    if (!enrollYear || !/^\d{2}$/.test(enrollYear)) {
      setError('Student ID must be a two-digit number.');
      return false;
    }
    if (departments.some((dep) => !dep.trim())) {
      setError('All department fields must be filled.');
      return false;
    }
    if (new Set(departments).size !== departments.length) {
      setError('Duplicate departments are not allowed.');
      return false;
    }
    if (!cvFile && !cvFileName) {
      setError('CV is required.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formattedEnrollYear =
      parseInt(enrollYear) < 50
        ? 2000 + parseInt(enrollYear)
        : 1900 + parseInt(enrollYear);
    const formattedDepartments = departments.join(',');
    const randomString = Math.random().toString(36).substring(2, 12);
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const cvKey = cvFileName
      ? `static/private/CV/${randomString}_${formattedDate}/${cvFileName}`
      : '';

    try {
      await apiClient.put('/api/applicant/me', {
        enrollYear: formattedEnrollYear,
        department: formattedDepartments,
        cvKey: cvKey,
      });
      alert('Profile saved successfully!');
      navigate('/mypage');
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError('Failed to save profile. Please try again.');
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Student ID (two-digit number)</label>
          <input
            type="text"
            value={enrollYear}
            onChange={(e) => setEnrollYear(e.target.value)}
            maxLength={2}
          />
        </div>
        <div>
          <label>Department (Main department first, up to 6 additional)</label>
          {departments.map((department, index) => (
            <div key={index}>
              <input
                type="text"
                value={department}
                onChange={(e) => handleDepartmentChange(index, e.target.value)}
              />
              {index > 0 && (
                <button type="button" onClick={() => removeDepartment(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addDepartment}>
            Add Department
          </button>
        </div>
        <div>
          <label>CV (PDF only, max 5MB)</label>
          <input type="file" accept=".pdf" onChange={handleCvChange} />
          {cvFileName && <p>Selected CV: {cvFileName}</p>}
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default ProfilePage;
