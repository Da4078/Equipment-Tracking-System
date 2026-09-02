import { useState, useEffect } from 'react';
import {
    Package,
    Users,
    CheckCircle2,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    Loader2,
    LogOut,
    Mail,
    UserCheck,
    RotateCcw,
    X,
    CheckCircle2 as CheckIcon,
    XCircle as XIcon,
    AlertTriangle,
    BarChart3,
    TrendingUp,
    CalendarDays,
    Lock,
    EyeOff
} from 'lucide-react';

import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import EquipmentModal from '../components/EquipmentModal.jsx';
import EmployeeEquipmentModal from '../components/EmployeeEquipmentModal.jsx';

export default function Dashboard() {

    const [activeTab, setActiveTab] = useState('overview');

    const [equipment, setEquipment] = useState([]);
    const [eqLoading, setEqLoading] = useState(true);
    const [eqError, setEqError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    const [assigningItem, setAssigningItem] = useState(null);
    const [activeEmployeesList, setActiveEmployeesList] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [assignLoading, setAssignLoading] = useState(false);
    const [assignSubmitting, setAssignSubmitting] = useState(false);
    const [assignError, setAssignError] = useState('');

    const [employees, setEmployees] = useState([]);
    const [empLoading, setEmpLoading] = useState(true);
    const [empError, setEmpError] = useState('');
    const [empSearchTerm, setEmpSearchTerm] = useState('');

    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeSaving, setEmployeeSaving] = useState(false);
    const [showEmployeePassword, setShowEmployeePassword] = useState(false);

    const [isEmployeeEquipmentModalOpen, setIsEmployeeEquipmentModalOpen] =
        useState(false);

    const [outstandingEquipment, setOutstandingEquipment] = useState([]);
    const [outstandingLoading, setOutstandingLoading] = useState(true);
    const [outstandingError, setOutstandingError] = useState('');

    const [employeeFormData, setEmployeeFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        hireDate: new Date().toISOString().split('T')[0],
        department: '',
        position: '',
        active: true,
        password: ''
    });

    const { logout, user } = useAuth();

    useEffect(() => {
        refreshDashboard();
    }, []);

    const refreshDashboard = async () => {
        await Promise.all([
            fetchEquipment(),
            fetchEmployees(),
            fetchOutstandingEquipment()
        ]);
    };

    const fetchEquipment = async () => {
        setEqLoading(true);
        setEqError('');

        try {
            const response = await api.get('/equipment');

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.content || [];

            setEquipment(data);
        } catch (err) {
            console.error('Failed to fetch equipment:', err);
            setEqError('Failed to load equipment inventory.');
            setEquipment([]);
        } finally {
            setEqLoading(false);
        }
    };

    const fetchEmployees = async () => {
        setEmpLoading(true);
        setEmpError('');

        try {
            const response = await api.get('/employees?page=0&size=100');

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.content || [];

            setEmployees(data);
        } catch (err) {
            console.error('Failed to fetch employees:', err);
            setEmpError('Failed to load employee directory.');
            setEmployees([]);
        } finally {
            setEmpLoading(false);
        }
    };

    const fetchOutstandingEquipment = async () => {
        setOutstandingLoading(true);
        setOutstandingError('');

        try {
            const response = await api.get('/equipment/outstanding');

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.content || [];

            setOutstandingEquipment(data);
        } catch (err) {
            console.error('Failed to fetch outstanding equipment:', err);
            setOutstandingError('Failed to load outstanding equipment.');
            setOutstandingEquipment([]);
        } finally {
            setOutstandingLoading(false);
        }
    };

    const handleOpenAddEquipment = () => {
        setSelectedEquipment(null);
        setIsEquipmentModalOpen(true);
    };

    const handleOpenEditEquipment = (item) => {
        setSelectedEquipment(item);
        setIsEquipmentModalOpen(true);
    };

    const handleDeleteEquipment = async (id) => {
        if (
            !window.confirm(
                'Are you sure you want to retire this equipment item?'
            )
        ) {
            return;
        }

        try {
            await api.delete(`/equipment/${id}`);

            await fetchEquipment();
            await fetchOutstandingEquipment();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                'Failed to retire equipment item.';

            alert(msg);
        }
    };

    const handleOpenAssignModal = async (item) => {
        setAssigningItem(item);
        setSelectedEmployeeId('');
        setAssignError('');
        setAssignLoading(true);

        try {
            const response = await api.get(
                '/employees?page=0&size=100'
            );

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.content || [];

            setActiveEmployeesList(
                data.filter((employee) => employee.active)
            );
        } catch (err) {
            console.error('Failed to fetch active employees:', err);

            setAssignError(
                'Could not load active employees list.'
            );

            setActiveEmployeesList([]);
        } finally {
            setAssignLoading(false);
        }
    };

    const handleConfirmAssign = async (e) => {
        e.preventDefault();

        if (!selectedEmployeeId || !assigningItem) {
            return;
        }

        setAssignSubmitting(true);
        setAssignError('');

        try {
            await api.post('/assignments', {
                employeeId: selectedEmployeeId,
                equipmentId: assigningItem.id
            });

            setAssigningItem(null);

            await refreshDashboard();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                'Failed to assign equipment.';

            setAssignError(msg);
        } finally {
            setAssignSubmitting(false);
        }
    };

    const handleReturnEquipment = async (item) => {
        if (
            !window.confirm(
                `Are you sure you want to return "${item.equipmentName}"?`
            )
        ) {
            return;
        }

        try {
            if (!item.assignmentId) {
                alert(
                    'This equipment does not contain an assignment ID.'
                );
                return;
            }

            await api.post(
                `/assignments/${item.assignmentId}/return`
            );

            await refreshDashboard();
        } catch (err) {
            console.error('Failed to return equipment:', err);

            const msg =
                err.response?.data?.message ||
                'Failed to return equipment.';

            alert(msg);
        }
    };

    const handleOpenAddEmployee = () => {
        setSelectedEmployee(null);
        setShowEmployeePassword(false);

        setEmployeeFormData({
            firstName: '',
            lastName: '',
            email: '',
            hireDate: new Date().toISOString().split('T')[0],
            department: '',
            position: '',
            active: true,
            password: ''
        });

        setIsEmployeeModalOpen(true);
    };

    const handleOpenEditEmployee = (emp) => {
        setSelectedEmployee(emp);
        setShowEmployeePassword(false);

        setEmployeeFormData({
            firstName: emp.firstName || '',
            lastName: emp.lastName || '',
            email: emp.email || '',
            hireDate: emp.hireDate
                ? emp.hireDate.split('T')[0]
                : '',
            department: emp.department || '',
            position: emp.position || '',
            active: emp.active ?? true,
            password: ''
        });

        setIsEmployeeModalOpen(true);
    };

    const handleCloseEmployeeModal = () => {
        if (employeeSaving) {
            return;
        }

        setIsEmployeeModalOpen(false);
        setSelectedEmployee(null);
        setShowEmployeePassword(false);
    };

    const handleOpenEmployeeEquipment = (employee) => {
        setSelectedEmployee(employee);
        setIsEmployeeEquipmentModalOpen(true);
    };

    const handleEmployeeSubmit = async (e) => {
        e.preventDefault();

        setEmployeeSaving(true);

        try {
            if (selectedEmployee) {

                const updateData = {
                    firstName: employeeFormData.firstName,
                    lastName: employeeFormData.lastName,
                    email: employeeFormData.email,
                    hireDate: employeeFormData.hireDate,
                    department: employeeFormData.department,
                    position: employeeFormData.position,
                    active: employeeFormData.active
                };

                await api.put(
                    `/employees/${selectedEmployee.id}`,
                    updateData
                );

            } else {

                const createData = {
                    firstName: employeeFormData.firstName,
                    lastName: employeeFormData.lastName,
                    email: employeeFormData.email,
                    hireDate: employeeFormData.hireDate,
                    department: employeeFormData.department,
                    position: employeeFormData.position,
                    password: employeeFormData.password
                };

                await api.post(
                    '/employees',
                    createData
                );
            }

            setIsEmployeeModalOpen(false);
            setSelectedEmployee(null);
            setShowEmployeePassword(false);

            await fetchEmployees();

        } catch (err) {
            console.error('Failed to save employee:', err);

            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.response?.data ||
                'Failed to save employee.';

            alert(
                typeof message === 'string'
                    ? message
                    : JSON.stringify(message)
            );
        } finally {
            setEmployeeSaving(false);
        }
    };

    const handleDeleteEmployee = async (id, fullName) => {
        if (
            !window.confirm(
                `Are you sure you want to offboard/delete ${fullName}?\n\n` +
                'The system will block this if they still hold active equipment.'
            )
        ) {
            return;
        }

        try {
            await api.delete(`/employees/${id}`);

            await fetchEmployees();
            await fetchEquipment();
            await fetchOutstandingEquipment();

        } catch (err) {
            const msg =
                err.response?.data?.message ||
                'Cannot delete employee with active equipment assignments.';

            alert(msg);
        }
    };

    const safeEquipment = Array.isArray(equipment)
        ? equipment
        : [];

    const safeEmployees = Array.isArray(employees)
        ? employees
        : [];

    const availableCount = safeEquipment.filter(
        (e) => e.status === 'AVAILABLE'
    ).length;

    const assignedCount = safeEquipment.filter(
        (e) => e.status === 'ASSIGNED'
    ).length;

    const retiredCount = safeEquipment.filter(
        (e) => e.status === 'RETIRED'
    ).length;

    const totalEquipment = safeEquipment.length;

    const activeEmployeeCount = safeEmployees.filter(
        (e) => e.active
    ).length;

    const employeesWithEquipment = safeEmployees.filter(
        (employee) =>
            safeEquipment.some(
                (item) =>
                    item.assignedEmployeeId === employee.id &&
                    item.status === 'ASSIGNED'
            )
    ).length;

    const filteredEquipment = safeEquipment.filter((item) => {
        const name =
            item.equipmentName ||
            item.name ||
            '';

        const category =
            item.type ||
            item.category ||
            '';

        const serial =
            item.serialNumber ||
            '';

        const search =
            searchTerm.toLowerCase();

        const matchesSearch =
            name.toLowerCase().includes(search) ||
            serial.toLowerCase().includes(search) ||
            category.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === 'ALL' ||
            item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const filteredEmployees = safeEmployees.filter((emp) => {
        const fullName =
            `${emp.firstName || ''} ${emp.lastName || ''}`
                .toLowerCase();

        const email =
            (emp.email || '').toLowerCase();

        const department =
            (emp.department || '').toLowerCase();

        const query =
            empSearchTerm.toLowerCase();

        return (
            fullName.includes(query) ||
            email.includes(query) ||
            department.includes(query)
        );
    });

    const employeeEquipmentCounts =
        safeEmployees
            .filter((employee) => employee.active)
            .map((employee) => {

                const count = safeEquipment.filter(
                    (item) =>
                        item.status === 'ASSIGNED' &&
                        item.assignedEmployeeId === employee.id
                ).length;

                return {
                    name: `${employee.firstName} ${employee.lastName}`,
                    count
                };
            })
            .filter((employee) => employee.count > 0)
            .sort((a, b) => b.count - a.count);

    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col">

            <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">

                <div className="flex items-center gap-6">

                    <div className="flex items-center gap-3">

                        <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
                            <Package className="w-6 h-6" />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-white tracking-wide">
                                Equipment Tracker
                            </h1>

                            <p className="text-xs text-slate-400">
                                Inventory & Personnel Portal
                            </p>
                        </div>

                    </div>

                    <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">

                        <NavButton
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            icon={<BarChart3 className="w-4 h-4" />}
                        >
                            Overview
                        </NavButton>

                        <NavButton
                            active={activeTab === 'equipment'}
                            onClick={() => setActiveTab('equipment')}
                            icon={<Package className="w-4 h-4" />}
                        >
                            Equipment
                        </NavButton>

                        <NavButton
                            active={activeTab === 'employees'}
                            onClick={() => setActiveTab('employees')}
                            icon={<Users className="w-4 h-4" />}
                        >
                            Employees
                        </NavButton>

                        <NavButton
                            active={activeTab === 'outstanding'}
                            onClick={() => setActiveTab('outstanding')}
                            icon={<AlertTriangle className="w-4 h-4" />}
                        >
                            Outstanding
                        </NavButton>

                    </nav>

                </div>

                <div className="flex items-center gap-4">

                    {user?.email && (
                        <span className="text-sm text-slate-400 hidden lg:inline">
                            Logged in as{' '}
                            <strong className="text-slate-200">
                                {user.email}
                            </strong>
                        </span>
                    )}

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>

                </div>

            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

                {activeTab === 'overview' && (
                    <>

                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Dashboard Overview
                            </h2>

                            <p className="text-sm text-slate-400 mt-1">
                                Monitor your equipment inventory and employee assignments.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                            <StatCard
                                title="Total Equipment"
                                value={totalEquipment}
                                icon={<Package className="w-6 h-6" />}
                                description="All inventory items"
                            />

                            <StatCard
                                title="Available"
                                value={availableCount}
                                icon={<CheckCircle2 className="w-6 h-6" />}
                                description="Ready to assign"
                            />

                            <StatCard
                                title="Currently Assigned"
                                value={assignedCount}
                                icon={<UserCheck className="w-6 h-6" />}
                                description="Currently with employees"
                            />

                            <StatCard
                                title="Retired"
                                value={retiredCount}
                                icon={<XIcon className="w-6 h-6" />}
                                description="No longer in service"
                            />

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                            <StatCard
                                title="Active Employees"
                                value={activeEmployeeCount}
                                icon={<Users className="w-6 h-6" />}
                                description="Currently employed"
                            />

                            <StatCard
                                title="Employees With Equipment"
                                value={employeesWithEquipment}
                                icon={<TrendingUp className="w-6 h-6" />}
                                description="Employees holding equipment"
                            />

                            <button
                                onClick={() => setActiveTab('outstanding')}
                                className="text-left bg-red-500/5 border border-red-500/20 rounded-xl p-5 hover:bg-red-500/10 transition-colors"
                            >
                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-slate-400">
                                            Outstanding Equipment
                                        </p>

                                        <h3 className="text-3xl font-bold text-red-400 mt-2">
                                            {outstandingEquipment.length}
                                        </h3>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Currently not returned
                                        </p>

                                    </div>

                                    <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>

                                </div>
                            </button>

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">

                                <div className="flex items-center justify-between mb-6">

                                    <div>
                                        <h3 className="font-semibold text-white">
                                            Equipment Status
                                        </h3>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Current inventory distribution
                                        </p>
                                    </div>

                                    <Package className="w-5 h-5 text-slate-500" />

                                </div>

                                <div className="flex items-center justify-center py-6">

                                    <EquipmentDonutChart
                                        available={availableCount}
                                        assigned={assignedCount}
                                        retired={retiredCount}
                                    />

                                </div>

                                <div className="grid grid-cols-3 gap-3 mt-4">

                                    <LegendItem
                                        label="Available"
                                        value={availableCount}
                                        className="text-emerald-400"
                                    />

                                    <LegendItem
                                        label="Assigned"
                                        value={assignedCount}
                                        className="text-blue-400"
                                    />

                                    <LegendItem
                                        label="Retired"
                                        value={retiredCount}
                                        className="text-slate-400"
                                    />

                                </div>

                            </div>

                            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">

                                <div className="flex items-center justify-between mb-6">

                                    <div>
                                        <h3 className="font-semibold text-white">
                                            Equipment Per Employee
                                        </h3>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Currently assigned equipment
                                        </p>
                                    </div>

                                    <Users className="w-5 h-5 text-slate-500" />

                                </div>

                                {employeeEquipmentCounts.length === 0 ? (

                                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">

                                        <Users className="w-10 h-10 mb-3 opacity-40" />

                                        <p className="text-sm">
                                            No equipment is currently assigned.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="space-y-5">

                                        {employeeEquipmentCounts
                                            .slice(0, 6)
                                            .map((employee) => {

                                                const max =
                                                    employeeEquipmentCounts[0].count;

                                                const percentage =
                                                    max > 0
                                                        ? (employee.count / max) * 100
                                                        : 0;

                                                return (
                                                    <div key={employee.name}>

                                                        <div className="flex items-center justify-between mb-2">

                                                            <span className="text-sm text-slate-300">
                                                                {employee.name}
                                                            </span>

                                                            <span className="text-sm font-semibold text-white">
                                                                {employee.count}
                                                            </span>

                                                        </div>

                                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                                                            <div
                                                                className="h-full bg-blue-500 rounded-full transition-all"
                                                                style={{
                                                                    width: `${percentage}%`
                                                                }}
                                                            />

                                                        </div>

                                                    </div>
                                                );
                                            })}

                                    </div>

                                )}

                            </div>

                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">

                            <h3 className="font-semibold text-white mb-4">
                                Quick Actions
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                                <QuickAction
                                    icon={<Plus className="w-5 h-5" />}
                                    title="Add Equipment"
                                    description="Register new equipment"
                                    onClick={handleOpenAddEquipment}
                                />

                                <QuickAction
                                    icon={<Users className="w-5 h-5" />}
                                    title="Manage Employees"
                                    description="View employee directory"
                                    onClick={() => setActiveTab('employees')}
                                />

                                <QuickAction
                                    icon={<AlertTriangle className="w-5 h-5" />}
                                    title="Outstanding Equipment"
                                    description="View items not yet returned"
                                    onClick={() => setActiveTab('outstanding')}
                                />

                            </div>

                        </div>

                    </>
                )}

                {activeTab === 'equipment' && (
                    <>

                        <PageHeader
                            title="Equipment"
                            description="Manage company equipment and assignments."
                            buttonText="Add Equipment"
                            onButtonClick={handleOpenAddEquipment}
                        />

                        <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">

                            <div className="relative flex-1">

                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                                <input
                                    type="text"
                                    placeholder="Search by name, serial number, category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />

                            </div>

                            <div className="relative">

                                <Filter className="absolute left-3 w-4 h-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="AVAILABLE">Available</option>
                                    <option value="ASSIGNED">Assigned</option>
                                    <option value="RETIRED">Retired</option>
                                </select>

                            </div>

                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">

                            {eqLoading ? (

                                <LoadingState text="Loading equipment inventory..." />

                            ) : eqError ? (

                                <ErrorState text={eqError} />

                            ) : filteredEquipment.length === 0 ? (

                                <EmptyState text="No equipment found." />

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full text-left">

                                        <thead>

                                        <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold uppercase tracking-wider text-slate-400">

                                            <th className="px-6 py-4">
                                                Equipment
                                            </th>

                                            <th className="px-6 py-4">
                                                Serial Number
                                            </th>

                                            <th className="px-6 py-4">
                                                Type
                                            </th>

                                            <th className="px-6 py-4">
                                                Employee
                                            </th>

                                            <th className="px-6 py-4">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-right">
                                                Actions
                                            </th>

                                        </tr>

                                        </thead>

                                        <tbody className="divide-y divide-slate-800/60 text-sm">

                                        {filteredEquipment.map((item) => (

                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-800/40"
                                            >

                                                <td className="px-6 py-4">

                                                    <div className="font-medium text-white">
                                                        {item.equipmentName || item.name}
                                                    </div>

                                                    {(item.brand || item.model) && (
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            {item.brand} {item.model}
                                                        </div>
                                                    )}

                                                </td>

                                                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                                    {item.serialNumber}
                                                </td>

                                                <td className="px-6 py-4 text-slate-400">
                                                    {item.type || item.category}
                                                </td>

                                                <td className="px-6 py-4">

                                                    {item.assignedEmployeeName ? (

                                                        <div>

                                                            <div className="text-slate-200">
                                                                {item.assignedEmployeeName}
                                                            </div>

                                                            {item.assignedAt && (
                                                                <div className="text-xs text-slate-500 mt-1">
                                                                    Assigned{' '}
                                                                    {formatDate(item.assignedAt)}
                                                                </div>
                                                            )}

                                                        </div>

                                                    ) : (

                                                        <span className="text-slate-600">
                                                            —
                                                        </span>

                                                    )}

                                                </td>

                                                <td className="px-6 py-4">
                                                    <StatusBadge status={item.status} />
                                                </td>

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center justify-end gap-2">

                                                        {item.status === 'AVAILABLE' && (

                                                            <button
                                                                onClick={() =>
                                                                    handleOpenAssignModal(item)
                                                                }
                                                                className="px-2.5 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded text-xs font-medium flex items-center gap-1"
                                                            >
                                                                <UserCheck className="w-3.5 h-3.5" />
                                                                Assign
                                                            </button>

                                                        )}

                                                        {item.status === 'ASSIGNED' && (

                                                            <button
                                                                onClick={() =>
                                                                    handleReturnEquipment(item)
                                                                }
                                                                className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-medium flex items-center gap-1"
                                                            >
                                                                <RotateCcw className="w-3.5 h-3.5" />
                                                                Return
                                                            </button>

                                                        )}

                                                        <button
                                                            onClick={() =>
                                                                handleOpenEditEquipment(item)
                                                            }
                                                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDeleteEquipment(item.id)
                                                            }
                                                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </>
                )}

                {activeTab === 'employees' && (
                    <>

                        <PageHeader
                            title="Employees"
                            description="Manage employees and view their equipment."
                            buttonText="Add Employee"
                            onButtonClick={handleOpenAddEmployee}
                        />

                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">

                            <div className="relative">

                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                                <input
                                    type="text"
                                    placeholder="Search by name, email, department..."
                                    value={empSearchTerm}
                                    onChange={(e) => setEmpSearchTerm(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />

                            </div>

                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">

                            {empLoading ? (

                                <LoadingState text="Loading employees..." />

                            ) : empError ? (

                                <ErrorState text={empError} />

                            ) : filteredEmployees.length === 0 ? (

                                <EmptyState text="No employees found." />

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full text-left">

                                        <thead>

                                        <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase tracking-wider text-slate-400">

                                            <th className="px-6 py-4">
                                                Employee
                                            </th>

                                            <th className="px-6 py-4">
                                                Contact
                                            </th>

                                            <th className="px-6 py-4">
                                                Department / Position
                                            </th>

                                            <th className="px-6 py-4">
                                                Equipment
                                            </th>

                                            <th className="px-6 py-4">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-right">
                                                Actions
                                            </th>

                                        </tr>

                                        </thead>

                                        <tbody className="divide-y divide-slate-800/60">

                                        {filteredEmployees.map((emp) => {

                                            const equipmentCount =
                                                safeEquipment.filter(
                                                    (item) =>
                                                        item.status === 'ASSIGNED' &&
                                                        item.assignedEmployeeId === emp.id
                                                ).length;

                                            return (

                                                <tr
                                                    key={emp.id}
                                                    className="hover:bg-slate-800/40"
                                                >

                                                    <td className="px-6 py-4">

                                                        <div className="font-medium text-white">
                                                            {emp.firstName} {emp.lastName}
                                                        </div>

                                                        <div className="text-xs text-slate-500 mt-1">
                                                            Hired{' '}
                                                            {emp.hireDate
                                                                ? formatDate(emp.hireDate)
                                                                : '—'}
                                                        </div>

                                                    </td>

                                                    <td className="px-6 py-4 text-slate-400">

                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-3.5 h-3.5" />
                                                            {emp.email}
                                                        </div>

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <div className="text-slate-200">
                                                            {emp.department || 'N/A'}
                                                        </div>

                                                        <div className="text-xs text-slate-500">
                                                            {emp.position || 'Staff'}
                                                        </div>

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                                                            {equipmentCount}{' '}
                                                            {equipmentCount === 1
                                                                ? 'item'
                                                                : 'items'}
                                                        </span>

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                                emp.active
                                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                                                            }`}
                                                        >

                                                            {emp.active
                                                                ? <CheckIcon className="w-3 h-3" />
                                                                : <XIcon className="w-3 h-3" />
                                                            }

                                                            {emp.active
                                                                ? 'Active'
                                                                : 'Offboarded'}

                                                        </span>

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <div className="flex justify-end gap-2">

                                                            <button
                                                                onClick={() =>
                                                                    handleOpenEmployeeEquipment(emp)
                                                                }
                                                                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded"
                                                                title="View employee details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleOpenEditEmployee(emp)
                                                                }
                                                                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteEmployee(
                                                                        emp.id,
                                                                        `${emp.firstName} ${emp.lastName}`
                                                                    )
                                                                }
                                                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            );
                                        })}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </>
                )}

                {activeTab === 'outstanding' && (
                    <>

                        <PageHeader
                            title="Outstanding Equipment"
                            description="Equipment currently assigned to employees and not yet returned."
                        />

                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">

                            <div className="flex items-start gap-4">

                                <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>

                                <div>

                                    <h3 className="font-semibold text-white">
                                        {outstandingEquipment.length}{' '}
                                        outstanding{' '}
                                        {outstandingEquipment.length === 1
                                            ? 'item'
                                            : 'items'}
                                    </h3>

                                    <p className="text-sm text-slate-400 mt-1">
                                        These items are currently assigned and
                                        have not been returned.
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">

                            {outstandingLoading ? (

                                <LoadingState text="Loading outstanding equipment..." />

                            ) : outstandingError ? (

                                <ErrorState text={outstandingError} />

                            ) : outstandingEquipment.length === 0 ? (

                                <div className="flex flex-col items-center justify-center py-16">

                                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />

                                    <h3 className="text-white font-semibold">
                                        Everything is accounted for
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1">
                                        There is currently no outstanding equipment.
                                    </p>

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full text-left">

                                        <thead>

                                        <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase tracking-wider text-slate-400">

                                            <th className="px-6 py-4">
                                                Equipment
                                            </th>

                                            <th className="px-6 py-4">
                                                Employee
                                            </th>

                                            <th className="px-6 py-4">
                                                Assigned
                                            </th>

                                            <th className="px-6 py-4">
                                                Duration
                                            </th>

                                            <th className="px-6 py-4 text-right">
                                                Action
                                            </th>

                                        </tr>

                                        </thead>

                                        <tbody className="divide-y divide-slate-800/60">

                                        {outstandingEquipment.map((item) => (

                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-800/40"
                                            >

                                                <td className="px-6 py-4">

                                                    <div className="font-medium text-white">
                                                        {item.equipmentName}
                                                    </div>

                                                    <div className="text-xs font-mono text-slate-500 mt-1">
                                                        {item.serialNumber}
                                                    </div>

                                                </td>

                                                <td className="px-6 py-4">

                                                    {item.assignedEmployeeName ? (

                                                        <div className="flex items-center gap-2">

                                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

                                                                <Users className="w-4 h-4 text-blue-400" />

                                                            </div>

                                                            <span className="text-slate-200">
                                                                {item.assignedEmployeeName}
                                                            </span>

                                                        </div>

                                                    ) : (
                                                        <span className="text-slate-600">
                                                            Unknown
                                                        </span>
                                                    )}

                                                </td>

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-2 text-slate-300">

                                                        <CalendarDays className="w-4 h-4 text-slate-500" />

                                                        {item.assignedAt
                                                            ? formatDate(item.assignedAt)
                                                            : 'N/A'}

                                                    </div>

                                                </td>

                                                <td className="px-6 py-4">

                                                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium">

                                                        {item.assignedAt
                                                            ? getDuration(item.assignedAt)
                                                            : 'Unknown'}

                                                    </span>

                                                </td>

                                                <td className="px-6 py-4 text-right">

                                                    <button
                                                        onClick={() =>
                                                            handleReturnEquipment(item)
                                                        }
                                                        className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium hover:bg-emerald-600/30 transition-colors inline-flex items-center gap-1.5"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        Return
                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </>
                )}

            </main>

            {isEquipmentModalOpen && (
                <EquipmentModal
                    equipment={selectedEquipment}
                    onClose={() =>
                        setIsEquipmentModalOpen(false)
                    }
                    onSuccess={refreshDashboard}
                />
            )}

            {assigningItem && (

                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">

                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">

                            <div className="flex items-center gap-2">

                                <UserCheck className="w-5 h-5 text-blue-500" />

                                <span className="font-bold text-white">
                                    Assign Equipment
                                </span>

                            </div>

                            <button
                                onClick={() => setAssigningItem(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                        </div>

                        <form
                            onSubmit={handleConfirmAssign}
                            className="p-6 space-y-5"
                        >

                            <div>

                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                                    Equipment
                                </label>

                                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">

                                    <div className="text-sm font-medium text-white">
                                        {assigningItem.equipmentName}
                                    </div>

                                    <div className="text-xs font-mono text-slate-500 mt-1">
                                        {assigningItem.serialNumber}
                                    </div>

                                </div>

                            </div>

                            <div>

                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                                    Employee
                                </label>

                                {assignLoading ? (

                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Loading employees...
                                    </div>

                                ) : (

                                    <select
                                        required
                                        value={selectedEmployeeId}
                                        onChange={(e) =>
                                            setSelectedEmployeeId(e.target.value)
                                        }
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                    >

                                        <option value="">
                                            -- Choose Employee --
                                        </option>

                                        {activeEmployeesList.map((emp) => (

                                            <option
                                                key={emp.id}
                                                value={emp.id}
                                            >
                                                {emp.firstName} {emp.lastName}
                                                {' '}({emp.department || 'General'})
                                            </option>

                                        ))}

                                    </select>

                                )}

                            </div>

                            {assignError && (

                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    {assignError}
                                </div>

                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">

                                <button
                                    type="button"
                                    onClick={() => setAssigningItem(null)}
                                    className="px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        assignSubmitting ||
                                        !selectedEmployeeId
                                    }
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                                >

                                    {assignSubmitting && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}

                                    Assign Equipment

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {isEmployeeModalOpen && (

                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">

                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">

                            <div>
                                <h2 className="font-bold text-white">
                                    {selectedEmployee
                                        ? 'Edit Employee'
                                        : 'Add Employee'}
                                </h2>

                                {!selectedEmployee && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        Creates the employee and their login account.
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleCloseEmployeeModal}
                                disabled={employeeSaving}
                                className="text-slate-400 hover:text-white disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>

                        </div>

                        <form
                            onSubmit={handleEmployeeSubmit}
                            className="p-6 space-y-4"
                        >

                            <div className="grid grid-cols-2 gap-4">

                                <FormInput
                                    label="First Name"
                                    value={employeeFormData.firstName}
                                    required
                                    maxLength={50}
                                    onChange={(value) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            firstName: value
                                        })
                                    }
                                />

                                <FormInput
                                    label="Last Name"
                                    value={employeeFormData.lastName}
                                    required
                                    maxLength={50}
                                    onChange={(value) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            lastName: value
                                        })
                                    }
                                />

                            </div>

                            <FormInput
                                label="Email"
                                type="email"
                                value={employeeFormData.email}
                                required
                                onChange={(value) =>
                                    setEmployeeFormData({
                                        ...employeeFormData,
                                        email: value
                                    })
                                }
                            />

                            {!selectedEmployee && (

                                <div>

                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                                        Login Password *
                                    </label>

                                    <div className="relative">

                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />

                                        <input
                                            type={
                                                showEmployeePassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            required
                                            minLength={6}
                                            maxLength={100}
                                            value={employeeFormData.password}
                                            onChange={(e) =>
                                                setEmployeeFormData({
                                                    ...employeeFormData,
                                                    password: e.target.value
                                                })
                                            }
                                            placeholder="At least 6 characters"
                                            autoComplete="new-password"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowEmployeePassword(
                                                    !showEmployeePassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                            tabIndex={-1}
                                            aria-label={
                                                showEmployeePassword
                                                    ? 'Hide password'
                                                    : 'Show password'
                                            }
                                        >
                                            {showEmployeePassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>

                                    </div>

                                    <p className="mt-1.5 text-xs text-slate-500">
                                        The employee will use this password to log in.
                                    </p>

                                </div>

                            )}

                            <div className="grid grid-cols-2 gap-4">

                                <FormInput
                                    label="Department"
                                    value={employeeFormData.department}
                                    maxLength={100}
                                    onChange={(value) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            department: value
                                        })
                                    }
                                />

                                <FormInput
                                    label="Position"
                                    value={employeeFormData.position}
                                    maxLength={100}
                                    onChange={(value) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            position: value
                                        })
                                    }
                                />

                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <FormInput
                                    label="Hire Date"
                                    type="date"
                                    value={employeeFormData.hireDate}
                                    onChange={(value) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            hireDate: value
                                        })
                                    }
                                />

                                {selectedEmployee && (

                                    <div>

                                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                                            Status
                                        </label>

                                        <select
                                            value={String(employeeFormData.active)}
                                            onChange={(e) =>
                                                setEmployeeFormData({
                                                    ...employeeFormData,
                                                    active:
                                                        e.target.value === 'true'
                                                })
                                            }
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white"
                                        >

                                            <option value="true">
                                                Active
                                            </option>

                                            <option value="false">
                                                Inactive / Left
                                            </option>

                                        </select>

                                    </div>

                                )}

                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">

                                <button
                                    type="button"
                                    onClick={handleCloseEmployeeModal}
                                    disabled={employeeSaving}
                                    className="px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 rounded-lg disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={employeeSaving}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                                >

                                    {employeeSaving && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}

                                    {selectedEmployee
                                        ? 'Save Changes'
                                        : 'Create Employee'}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {isEmployeeEquipmentModalOpen && selectedEmployee && (

                <EmployeeEquipmentModal
                    employee={selectedEmployee}
                    onClose={() => {
                        setIsEmployeeEquipmentModalOpen(false);
                        setSelectedEmployee(null);
                    }}
                />

            )}

        </div>
    );
}

function NavButton({
                       active,
                       onClick,
                       icon,
                       children
                   }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
        >
            {icon}
            {children}
        </button>
    );
}

function StatCard({
                      title,
                      value,
                      icon,
                      description
                  }) {
    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-400">
                        {title}
                    </p>

                    <h3 className="text-3xl font-bold text-white mt-2">
                        {value}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                        {description}
                    </p>

                </div>

                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                    {icon}
                </div>

            </div>

        </div>
    );
}

function PageHeader({
                        title,
                        description,
                        buttonText,
                        onButtonClick
                    }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>

                <h2 className="text-2xl font-bold text-white">
                    {title}
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                    {description}
                </p>

            </div>

            {buttonText && (

                <button
                    onClick={onButtonClick}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {buttonText}
                </button>

            )}

        </div>
    );
}

function QuickAction({
                         icon,
                         title,
                         description,
                         onClick
                     }) {
    return (
        <button
            onClick={onClick}
            className="text-left p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500/40 hover:bg-slate-900 transition-colors"
        >

            <div className="flex items-center gap-3">

                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    {icon}
                </div>

                <div>

                    <div className="text-sm font-semibold text-white">
                        {title}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                        {description}
                    </div>

                </div>

            </div>

        </button>
    );
}

function LegendItem({
                        label,
                        value,
                        className
                    }) {
    return (
        <div className="text-center">

            <div className={`text-xl font-bold ${className}`}>
                {value}
            </div>

            <div className="text-[11px] text-slate-500">
                {label}
            </div>

        </div>
    );
}

function StatusBadge({ status }) {

    const styles = {
        AVAILABLE:
            'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',

        ASSIGNED:
            'bg-blue-500/10 text-blue-400 border-blue-500/30',

        RETIRED:
            'bg-slate-800 text-slate-400 border-slate-700'
    };

    const labels = {
        AVAILABLE: 'Available',
        ASSIGNED: 'Assigned',
        RETIRED: 'Retired'
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                styles[status] ||
                'bg-slate-800 text-slate-400 border-slate-700'
            }`}
        >
            {labels[status] || status}
        </span>
    );
}

function LoadingState({ text }) {
    return (
        <div className="flex items-center justify-center p-12 text-slate-400 gap-3">

            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />

            <span>{text}</span>

        </div>
    );
}

function ErrorState({ text }) {
    return (
        <div className="p-10 text-center text-red-400 text-sm">
            {text}
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="p-12 text-center text-slate-500 text-sm">
            {text}
        </div>
    );
}

function FormInput({
                       label,
                       value,
                       onChange,
                       type = 'text',
                       required = false,
                       maxLength
                   }) {
    return (
        <div>

            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                {label}
                {required && ' *'}
            </label>

            <input
                type={type}
                required={required}
                maxLength={maxLength}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />

        </div>
    );
}

function EquipmentDonutChart({
                                 available,
                                 assigned,
                                 retired
                             }) {

    const total =
        available +
        assigned +
        retired;

    if (total === 0) {
        return (
            <div className="w-48 h-48 rounded-full border-[18px] border-slate-800 flex items-center justify-center">

                <div className="text-center">

                    <div className="text-2xl font-bold text-white">
                        0
                    </div>

                    <div className="text-xs text-slate-500">
                        Equipment
                    </div>

                </div>

            </div>
        );
    }

    const availablePercent =
        (available / total) * 100;

    const assignedPercent =
        (assigned / total) * 100;

    const first =
        availablePercent;

    const second =
        availablePercent +
        assignedPercent;

    return (
        <div
            className="w-48 h-48 rounded-full flex items-center justify-center"
            style={{
                background: `conic-gradient(
                    #10b981 0% ${first}%,
                    #3b82f6 ${first}% ${second}%,
                    #475569 ${second}% 100%
                )`
            }}
        >

            <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center">

                <div className="text-center">

                    <div className="text-3xl font-bold text-white">
                        {total}
                    </div>

                    <div className="text-xs text-slate-500">
                        Total
                    </div>

                </div>

            </div>

        </div>
    );
}

function formatDate(value) {

    if (!value) {
        return 'N/A';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'N/A';
    }

    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getDuration(startDate) {

    const start =
        new Date(startDate);

    if (Number.isNaN(start.getTime())) {
        return 'Unknown';
    }

    const now =
        new Date();

    const diff =
        now.getTime() -
        start.getTime();

    const days =
        Math.max(
            0,
            Math.floor(
                diff /
                (1000 * 60 * 60 * 24)
            )
        );

    if (days === 0) {
        return 'Today';
    }

    if (days === 1) {
        return '1 day';
    }

    return `${days} days`;
}