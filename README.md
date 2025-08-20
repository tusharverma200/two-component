# React Component Development Assignment

A comprehensive React component library featuring two production-ready components: **InputField** and **DataTable**. Built with TypeScript, modern React patterns, and accessibility best practices.

## 🚀 Live Demo

[View Live Demo](https://your-deployment-url.vercel.app)

## 📋 Assignment Overview

This project fulfills the React Component Development Assignment requirements by implementing:

### Component 1: InputField 🎯
A flexible, reusable input component with comprehensive features:
- **Multiple Input Types**: text, email, password, number, tel, url, search
- **Built-in Validation**: Custom validation rules with real-time feedback
- **Size Variants**: Small, medium, and large sizes
- **Style Variants**: Default, outline, and filled styles
- **Advanced Features**: Prefix/suffix support, password visibility toggle, error states
- **Accessibility**: Full ARIA support, screen reader compatible
- **Controlled/Uncontrolled**: Supports both controlled and uncontrolled modes

### Component 2: DataTable 📊
A feature-rich data table component for complex data visualization:
- **Sorting**: Clickable column headers with visual indicators
- **Search**: Global search across all columns
- **Pagination**: Configurable page sizes with navigation controls
- **Selection**: Single and multiple row selection
- **Actions**: Customizable action buttons per row
- **Export**: Built-in CSV export functionality
- **Responsive**: Mobile-friendly design
- **Customizable**: Multiple size variants and styling options

## 🛠️ Technical Implementation

### Technologies Used
- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast development and build tooling
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities
- **Lucide React** - Modern icon library
- **CSS Custom Properties** - Consistent design system

### Key Features
- **Type Safety**: Comprehensive TypeScript interfaces
- **Performance**: Optimized with useMemo and useCallback
- **Accessibility**: WCAG 2.1 AA compliant
- **Responsive Design**: Mobile-first approach
- **Modern CSS**: Custom properties, flexbox, and grid
- **Testing**: Comprehensive unit test coverage
- **Documentation**: Inline comments and prop documentation

## 🏗️ Project Structure

```
src/
├── components/
│   ├── InputField/
│   │   ├── InputField.tsx       # Main component
│   │   ├── InputField.css       # Styles
│   │   ├── __tests__/           # Tests
│   │   └── index.ts             # Exports
│   └── DataTable/
│       ├── DataTable.tsx        # Main component
│       ├── DataTable.css        # Styles
│       ├── __tests__/           # Tests
│       └── index.ts             # Exports
├── types/
│   └── index.ts                 # TypeScript interfaces
├── data/
│   └── mockData.ts              # Sample data
├── test/
│   └── setup.ts                 # Test configuration
└── App.tsx                      # Demo application
```

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-component-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run lint         # Run ESLint
```

## 🧪 Testing

The project includes comprehensive unit tests for both components:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

### Test Coverage
- Input validation and error handling
- User interactions (typing, clicking, keyboard navigation)
- Component state management
- Prop variations and edge cases
- Accessibility features

## 📖 Component Documentation

### InputField Component

#### Basic Usage
```tsx
import InputField from './components/InputField';

<InputField
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(value) => setEmail(value)}
  required
  rules={[
    { required: true, message: 'Email is required' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
  ]}
/>
```

#### Props Interface
```tsx
interface InputFieldProps {
  // Basic props
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  
  // Styling
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
  
  // States
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  
  // Validation
  error?: string;
  helperText?: string;
  rules?: ValidationRule[];
  
  // Enhancements
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  
  // Events
  onChange?: (value: string, event: ChangeEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onEnter?: (value: string, event: KeyboardEvent) => void;
}
```

### DataTable Component

#### Basic Usage
```tsx
import DataTable from './components/DataTable';

const columns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Role' }
];

const actions = [
  {
    label: 'Edit',
    icon: <Edit size={16} />,
    onClick: (record) => handleEdit(record)
  }
];

<DataTable
  data={users}
  columns={columns}
  actions={actions}
  pagination={{
    current: 1,
    pageSize: 10,
    total: users.length
  }}
  sortable
  searchable
  selectable
  exportable
  onSelectionChange={(rows, keys) => setSelected(rows)}
/>
```

## 🎨 Design System

The project uses a comprehensive design system with:

### Color Palette
- **Primary**: Blue color scheme for interactive elements
- **Gray**: Neutral colors for text and backgrounds  
- **Success**: Green for positive states
- **Error**: Red for error states
- **Warning**: Amber for warning states

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700
- **Line Heights**: Optimized for readability

### Spacing System
- **Base Unit**: 8px
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px

### Border Radius
- **Small**: 4px
- **Default**: 8px  
- **Large**: 12px
- **Extra Large**: 16px

## ♿ Accessibility

Both components are built with accessibility in mind:

### InputField Accessibility
- Proper ARIA labels and descriptions
- Screen reader announcements for errors
- Keyboard navigation support
- High contrast mode support
- Focus management

### DataTable Accessibility
- Semantic table markup
- Sortable column indicators
- Screen reader friendly pagination
- Keyboard navigation
- ARIA labels for interactive elements

## 📱 Responsive Design

The components are fully responsive with:
- Mobile-first CSS approach
- Flexible grid layouts
- Touch-friendly interactive elements
- Optimized font sizes for mobile
- Horizontal scrolling for tables on small screens

## 🔧 Customization

Both components are highly customizable:

### CSS Custom Properties
```css
:root {
  --primary-500: #3b82f6;
  --gray-900: #111827;
  --border-radius: 8px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Component Variants
- Multiple size options (sm, md, lg)
- Different visual styles
- Configurable features (borders, stripes, hover effects)

## 🚀 Deployment

The project is optimized for deployment on modern platforms:

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Other Platforms
The build output is standard HTML/CSS/JS that can be deployed anywhere.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Create a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Author

Created as a React Component Development Assignment showcasing modern React development practices.

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Testing Library Docs](https://testing-library.com/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 💡 Key Learnings

This project demonstrates:
- Modern React development with hooks and TypeScript
- Component design patterns and reusability
- Accessibility best practices
- Performance optimization techniques
- Comprehensive testing strategies
- CSS architecture for maintainable styles
- Responsive design implementation