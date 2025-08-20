import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataTable from '../DataTable';
import { Column } from '../../../types';

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
];

const mockColumns: Column[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Role', sortable: true },
];

describe('DataTable', () => {
  it('renders table with data', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('displays column headers', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        emptyText="No records found"
      />
    );

    expect(screen.getByText('No records found')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        loading
        loadingText="Loading data..."
      />
    );

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    const user = userEvent.setup();
    
    render(<DataTable data={mockData} columns={mockColumns} searchable />);

    const searchInput = screen.getByPlaceholderText('Search table...');
    await user.type(searchInput, 'Jane');

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('handles sorting', async () => {
    const user = userEvent.setup();
    const handleSort = vi.fn();
    
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        sortable
        onSortChange={handleSort}
      />
    );

    const nameHeader = screen.getByLabelText('Sort by Name');
    await user.click(nameHeader);

    expect(handleSort).toHaveBeenCalledWith({
      field: 'name',
      order: 'asc'
    });
  });

  it('handles row selection', async () => {
    const user = userEvent.setup();
    const handleSelection = vi.fn();
    
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        selectable
        onSelectionChange={handleSelection}
      />
    );

    const firstRowCheckbox = screen.getAllByLabelText('Select row')[0];
    await user.click(firstRowCheckbox);

    expect(handleSelection).toHaveBeenCalledWith(
      [mockData[0]],
      [1]
    );
  });

  it('handles select all functionality', async () => {
    const user = userEvent.setup();
    const handleSelection = vi.fn();
    
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        selectable
        onSelectionChange={handleSelection}
      />
    );

    const selectAllCheckbox = screen.getByLabelText('Select all');
    await user.click(selectAllCheckbox);

    expect(handleSelection).toHaveBeenCalledWith(
      mockData,
      [1, 2, 3]
    );
  });

  it('handles pagination', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        pagination={{
          current: 1,
          pageSize: 2,
          total: 3,
          showSizeChanger: true
        }}
      />
    );

    expect(screen.getByText('Showing 1-2 of 3 items')).toBeInTheDocument();
    expect(screen.getByText('Next page')).toBeInTheDocument();
  });

  it('handles page size change', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        pagination={{
          current: 1,
          pageSize: 10,
          total: 3,
          showSizeChanger: true
        }}
        onPageChange={handlePageChange}
      />
    );

    const pageSizeSelect = screen.getByDisplayValue('10 / page');
    await user.selectOptions(pageSizeSelect, '25');

    expect(handlePageChange).toHaveBeenCalledWith(1, 25);
  });

  it('handles export functionality', async () => {
    const user = userEvent.setup();
    const handleExport = vi.fn();
    
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        exportable
        onExport={handleExport}
      />
    );

    const exportButton = screen.getByText('Export');
    await user.click(exportButton);

    expect(handleExport).toHaveBeenCalledWith('csv', mockData);
  });

  it('renders action buttons', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();
    
    const actions = [
      {
        label: 'Edit',
        onClick: handleAction,
        icon: <span>Edit</span>
      }
    ];

    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        actions={actions}
      />
    );

    const actionButtons = screen.getAllByTitle('Edit');
    await user.click(actionButtons[0]);

    expect(handleAction).toHaveBeenCalledWith(mockData[0]);
  });

  it('applies different sizes', () => {
    const { container, rerender } = render(
      <DataTable data={mockData} columns={mockColumns} size="sm" />
    );
    expect(container.firstChild).toHaveClass('data-table--sm');

    rerender(
      <DataTable data={mockData} columns={mockColumns} size="lg" />
    );
    expect(container.firstChild).toHaveClass('data-table--lg');
  });

  it('applies styling options', () => {
    const { container } = render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        bordered={false}
        striped={false}
        hoverable={false}
      />
    );
    const table = container.firstChild;
    expect(table).not.toHaveClass('data-table--bordered');
    expect(table).not.toHaveClass('data-table--striped');
    expect(table).not.toHaveClass('data-table--hoverable');
  });

  it('handles custom row key', () => {
    const customRowKey = (record: any) => `custom-${record.id}`;
    
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        selectable
        rowKey={customRowKey}
      />
    );

    // Check that rows are rendered (implies custom key is working)
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('handles custom cell rendering', () => {
    const customColumns: Column[] = [
      {
        key: 'name',
        title: 'Name',
        render: (value) => <strong>{value.toUpperCase()}</strong>
      }
    ];

    render(<DataTable data={mockData} columns={customColumns} />);

    expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
  });
});