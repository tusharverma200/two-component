import React, { useState } from 'react';
import { Mail, User, Eye, Edit, Trash2, Building, Calendar } from 'lucide-react';
import InputField from './components/InputField';
import DataTable from './components/DataTable';
import { mockUsers } from './data/mockData';
import { User as UserType, Column, TableAction, ValidationRule } from './types';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    salary: '',
    search: ''
  });

  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);

  // Form validation rules
  const emailRules: ValidationRule[] = [
    { required: true, message: 'Email is required' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' }
  ];

  const passwordRules: ValidationRule[] = [
    { required: true, message: 'Password is required' },
    { min: 8, message: 'Password must be at least 8 characters' },
    { pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Password must contain uppercase, lowercase and number' }
  ];

  const confirmPasswordRules: ValidationRule[] = [
    { required: true, message: 'Please confirm your password' },
    {
      validator: (value: string) => value === formData.password,
      message: 'Passwords do not match'
    }
  ];

  const phoneRules: ValidationRule[] = [
    { pattern: /^\+?[\d\s\-\(\)]+$/, message: 'Please enter a valid phone number' }
  ];

  const websiteRules: ValidationRule[] = [
    { pattern: /^https?:\/\/.+\..+/, message: 'Please enter a valid URL (http:// or https://)' }
  ];

  const salaryRules: ValidationRule[] = [
    { pattern: /^\d+$/, message: 'Please enter a valid salary amount' }
  ];

  // Handle form input changes
  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted! Check the console for data.');
  };

  // Table columns configuration
  const columns: Column<UserType>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value, record) => (
        <div className="user-info">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div>
            <div className="user-name">{value}</div>
            <div className="user-id">ID: {record.id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      render: (value) => (
        <div className="user-email">
          <Mail size={14} />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      render: (value) => <span className="user-role">{value}</span>
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`status-badge status-badge--${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'department',
      title: 'Department',
      sortable: true,
      render: (value) => (
        <div className="user-department">
          <Building size={14} />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      sortable: true,
      render: (value) => (
        <div className="user-date">
          <Calendar size={14} />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'salary',
      title: 'Salary',
      sortable: true,
      render: (value) => value ? `$${value.toLocaleString()}` : '-'
    }
  ];

  // Table actions
  const actions: TableAction<UserType>[] = [
    {
      label: 'View',
      icon: <Eye size={16} />,
      onClick: (record) => alert(`Viewing ${record.name}`),
      className: 'action-view'
    },
    {
      label: 'Edit',
      icon: <Edit size={16} />,
      onClick: (record) => alert(`Editing ${record.name}`),
      className: 'action-edit'
    },
    {
      label: 'Delete',
      icon: <Trash2 size={16} />,
      onClick: (record) => {
        if (confirm(`Are you sure you want to delete ${record.name}?`)) {
          alert(`Deleted ${record.name}`);
        }
      },
      className: 'action-delete',
      disabled: (record) => record.status === 'active' && record.role.includes('Manager')
    }
  ];

  // Handle selection change
  const handleSelectionChange = (selectedRows: UserType[], selectedRowKeys: (string | number)[]) => {
    setSelectedUsers(selectedRows);
    console.log('Selected users:', selectedRows);
  };

  // Handle export
  const handleExport = (format: 'csv' | 'excel', data: UserType[]) => {
    console.log(`Exporting ${data.length} records as ${format}`);
    alert(`Exported ${data.length} records as ${format.toUpperCase()}`);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">React Component Development Assignment</h1>
        <p className="app-subtitle">
          Demonstrating InputField and DataTable components with TypeScript, validation, and modern design
        </p>
      </div>

      <div className="app-content">
        {/* InputField Component Demo */}
        <section className="demo-section">
          <div className="section-header">
            <h2 className="section-title">🔧 Component 1: InputField</h2>
            <p className="section-description">
              A reusable input component with validation, multiple types, and accessibility features
            </p>
          </div>

          <div className="demo-card">
            <h3 className="demo-title">User Registration Form</h3>
            <form onSubmit={handleSubmit} className="demo-form">
              <div className="form-row">
                <InputField
                  label="First Name"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  required
                  rules={[{ required: true, message: 'First name is required' }]}
                />
                
                <InputField
                  label="Last Name"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  required
                  rules={[{ required: true, message: 'Last name is required' }]}
                />
              </div>

              <InputField
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                rules={emailRules}
                prefix={<Mail size={16} />}
                helperText="We'll never share your email with anyone else"
              />

              <div className="form-row">
                <InputField
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  rules={passwordRules}
                />
                
                <InputField
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  required
                  rules={confirmPasswordRules}
                />
              </div>

              <div className="form-row">
                <InputField
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  rules={phoneRules}
                  helperText="Optional - for account verification"
                />
                
                <InputField
                  label="Website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={handleInputChange('website')}
                  rules={websiteRules}
                />
              </div>

              <div className="form-row">
                <InputField
                  label="Expected Salary"
                  type="number"
                  placeholder="75000"
                  value={formData.salary}
                  onChange={handleInputChange('salary')}
                  rules={salaryRules}
                  prefix="$"
                  suffix="USD"
                  min={0}
                  step={1000}
                />
                
                <InputField
                  label="Search"
                  type="search"
                  placeholder="Search anything..."
                  value={formData.search}
                  onChange={handleInputChange('search')}
                  size="lg"
                  variant="filled"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Create Account
                </button>
                <button
                  type="button"
                  className="reset-button"
                  onClick={() => setFormData({
                    firstName: '', lastName: '', email: '', password: '',
                    confirmPassword: '', phone: '', website: '', salary: '', search: ''
                  })}
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>

          {/* Input Variants Demo */}
          <div className="demo-card">
            <h3 className="demo-title">Input Variants & Sizes</h3>
            <div className="variants-demo">
              <div className="variant-group">
                <h4>Sizes</h4>
                <InputField label="Small" size="sm" placeholder="Small input" />
                <InputField label="Medium (default)" size="md" placeholder="Medium input" />
                <InputField label="Large" size="lg" placeholder="Large input" />
              </div>
              
              <div className="variant-group">
                <h4>States</h4>
                <InputField label="Normal" placeholder="Normal input" />
                <InputField label="Disabled" placeholder="Disabled input" disabled />
                <InputField label="Read-only" value="Read-only value" readonly />
                <InputField
                  label="With Error"
                  placeholder="This has an error"
                  error="This field has an error"
                />
              </div>
              
              <div className="variant-group">
                <h4>Variants</h4>
                <InputField label="Default" variant="default" placeholder="Default variant" />
                <InputField label="Outline" variant="outline" placeholder="Outline variant" />
                <InputField label="Filled" variant="filled" placeholder="Filled variant" />
              </div>
            </div>
          </div>
        </section>

        {/* DataTable Component Demo */}
        <section className="demo-section">
          <div className="section-header">
            <h2 className="section-title">📊 Component 2: DataTable</h2>
            <p className="section-description">
              A feature-rich data table with sorting, filtering, pagination, selection, and export capabilities
            </p>
          </div>

          <div className="demo-card">
            <h3 className="demo-title">Employee Management System</h3>
            <DataTable
              data={mockUsers}
              columns={columns}
              pagination={{
                current: 1,
                pageSize: 10,
                total: mockUsers.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`
              }}
              sortable
              searchable
              selectable
              exportable
              actions={actions}
              onSelectionChange={handleSelectionChange}
              onExport={handleExport}
              size="md"
              bordered
              striped
              hoverable
              emptyText="No employees found"
              loadingText="Loading employees..."
            />
          </div>

          {/* Table Variants Demo */}
          <div className="demo-card">
            <h3 className="demo-title">Table Variants</h3>
            <div className="table-variants">
              <div className="variant-demo">
                <h4>Compact Table (Small Size)</h4>
                <DataTable
                  data={mockUsers.slice(0, 5)}
                  columns={columns.slice(0, 4)}
                  size="sm"
                  pagination={false}
                  searchable={false}
                  exportable={false}
                />
              </div>
              
              <div className="variant-demo">
                <h4>Large Table with Loading State</h4>
                <DataTable
                  data={mockUsers.slice(0, 3)}
                  columns={columns.slice(0, 3)}
                  size="lg"
                  loading
                  pagination={false}
                  searchable={false}
                  exportable={false}
                />
              </div>
              
              <div className="variant-demo">
                <h4>Minimal Table (No Border, No Stripes)</h4>
                <DataTable
                  data={mockUsers.slice(0, 4)}
                  columns={columns.slice(0, 3)}
                  bordered={false}
                  striped={false}
                  hoverable={false}
                  pagination={false}
                  searchable={false}
                  exportable={false}
                  selectable={false}
                />
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedUsers.length > 0 && (
            <div className="demo-card">
              <h3 className="demo-title">Selected Users ({selectedUsers.length})</h3>
              <div className="selected-users">
                {selectedUsers.map(user => (
                  <div key={user.id} className="selected-user">
                    <div className="selected-user-info">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <span className={`status-badge status-badge--${user.status}`}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Features Summary */}
        <section className="demo-section">
          <div className="section-header">
            <h2 className="section-title">✨ Features Overview</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <h3>🎯 InputField Features</h3>
              <ul>
                <li>Multiple input types (text, email, password, number, etc.)</li>
                <li>Built-in validation with custom rules</li>
                <li>Size variants (sm, md, lg)</li>
                <li>Style variants (default, outline, filled)</li>
                <li>Prefix/suffix support</li>
                <li>Error states and helper text</li>
                <li>Accessibility features (ARIA labels, screen reader support)</li>
                <li>Password visibility toggle</li>
                <li>Controlled and uncontrolled modes</li>
              </ul>
            </div>

            <div className="feature-card">
              <h3>📋 DataTable Features</h3>
              <ul>
                <li>Sortable columns with visual indicators</li>
                <li>Global search functionality</li>
                <li>Pagination with size controls and quick jump</li>
                <li>Row selection (single and multiple)</li>
                <li>Custom cell rendering</li>
                <li>Action buttons per row</li>
                <li>Export functionality (CSV)</li>
                <li>Loading and empty states</li>
                <li>Responsive design</li>
                <li>Customizable styling and variants</li>
              </ul>
            </div>

            <div className="feature-card">
              <h3>🏗️ Technical Implementation</h3>
              <ul>
                <li>TypeScript for type safety</li>
                <li>Modern React with hooks</li>
                <li>Modular CSS with custom properties</li>
                <li>Accessibility best practices (WCAG compliant)</li>
                <li>Performance optimizations (useMemo, useCallback)</li>
                <li>Clean, maintainable code structure</li>
                <li>Comprehensive prop interfaces</li>
                <li>Unit testing ready</li>
                <li>Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <footer className="app-footer">
        <p>Built with React, TypeScript, and modern web development practices</p>
        <p>Components ready for production use with comprehensive documentation</p>
      </footer>
    </div>
  );
}

export default App;