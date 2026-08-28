import { useState, useEffect } from 'react';
import { X, Loader2, PackagePlus, Edit3 } from 'lucide-react';
import api from '../api/axios.js';

export default function EquipmentModal({ equipment, onClose, onSuccess }) {
    const isEditMode = Boolean(equipment?.id);

    const [formData, setFormData] = useState({
        equipmentName: '',
        type: 'LAPTOP',
        brand: '',
        model: '',
        serialNumber: '',
        status: 'AVAILABLE'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode && equipment) {
            setFormData({
                equipmentName: equipment.equipmentName || equipment.name || '',
                type: equipment.type || 'LAPTOP',
                brand: equipment.brand || '',
                model: equipment.model || '',
                serialNumber: equipment.serialNumber || '',
                status: equipment.status || 'AVAILABLE'
            });
        } else {
            // Fresh creation always starts as AVAILABLE automatically
            setFormData({
                equipmentName: '',
                type: 'LAPTOP',
                brand: '',
                model: '',
                serialNumber: '',
                status: 'AVAILABLE'
            });
        }
    }, [equipment, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode) {
                await api.put(`/equipment/${equipment.id}`, formData);
            } else {
                await api.post('/equipment', formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save equipment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-6 shadow-2xl">

                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                        {isEditMode ? <Edit3 className="w-5 h-5 text-blue-400" /> : <PackagePlus className="w-5 h-5 text-blue-400" />}
                        <h2>{isEditMode ? 'Edit Equipment' : 'Add Equipment'}</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Equipment Name *</label>
                            <input
                                type="text"
                                name="equipmentName"
                                value={formData.equipmentName}
                                onChange={handleChange}
                                required
                                placeholder="e.g. MacBook Pro 16&quot;"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Categorized Equipment Type Dropdown */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Equipment Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                            >
                                <optgroup label="Computers">
                                    <option value="LAPTOP">Laptop</option>
                                    <option value="DESKTOP">Desktop PC</option>
                                    <option value="WORKSTATION">Workstation</option>
                                    <option value="MINI_PC">Mini PC</option>
                                    <option value="ALL_IN_ONE_PC">All-in-One PC</option>
                                    <option value="SERVER">Server</option>
                                </optgroup>
                                <optgroup label="Displays">
                                    <option value="MONITOR">Monitor</option>
                                    <option value="ULTRAWIDE_MONITOR">Ultrawide Monitor</option>
                                    <option value="PORTABLE_MONITOR">Portable Monitor</option>
                                    <option value="PROJECTOR">Projector</option>
                                    <option value="TV_SCREEN">TV Screen</option>
                                </optgroup>
                                <optgroup label="Audio & Video">
                                    <option value="HEADSET">Headset</option>
                                    <option value="MICROPHONE">Microphone</option>
                                    <option value="SPEAKER_PHONE">Speaker Phone</option>
                                    <option value="CONFERENCE_CAMERA">Conference Camera</option>
                                    <option value="WEBCAM">Webcam</option>
                                    <option value="STUDIO_HEADPHONES">Studio Headphones</option>
                                </optgroup>
                                <optgroup label="Mobile & Tablets">
                                    <option value="PHONE">Phone</option>
                                    <option value="SMARTPHONE">Smartphone</option>
                                    <option value="TABLET">Tablet</option>
                                    <option value="E_READER">E-Reader</option>
                                    <option value="SMARTWATCH">Smartwatch</option>
                                </optgroup>
                                <optgroup label="Peripherals & Input">
                                    <option value="KEYBOARD">Keyboard</option>
                                    <option value="MOUSE">Mouse</option>
                                    <option value="ERGONOMIC_KEYBOARD">Ergonomic Keyboard</option>
                                    <option value="VERTICAL_MOUSE">Vertical Mouse</option>
                                    <option value="TRACKPAD">Trackpad</option>
                                    <option value="PRESENTATION_CLICKER">Presentation Clicker</option>
                                    <option value="GRAPHICS_TABLET">Graphics Tablet</option>
                                </optgroup>
                                <optgroup label="Connectivity & Power">
                                    <option value="DOCKING_STATION">Docking Station</option>
                                    <option value="USB_HUB">USB Hub</option>
                                    <option value="EXTERNAL_SSD">External SSD</option>
                                    <option value="EXTERNAL_HDD">External HDD</option>
                                    <option value="THUNDERBOLT_ADAPTER">Thunderbolt Adapter</option>
                                    <option value="POWER_BANK">Power Bank</option>
                                    <option value="UPS_BATTERY_BACKUP">UPS Battery Backup</option>
                                </optgroup>
                                <optgroup label="Networking & Telecom">
                                    <option value="ROUTER">Router</option>
                                    <option value="SWITCH">Network Switch</option>
                                    <option value="ACCESS_POINT">Wi-Fi Access Point</option>
                                    <option value="VOIP_PHONE">VoIP Phone</option>
                                    <option value="MODEM">Modem</option>
                                </optgroup>
                                <optgroup label="Miscellaneous">
                                    <option value="PRINTER">Printer</option>
                                    <option value="SCANNER">Document Scanner</option>
                                    <option value="BARCODE_SCANNER">Barcode Scanner</option>
                                    <option value="LABEL_MAKER">Label Maker</option>
                                    <option value="VR_HEADSET">VR Headset</option>
                                    <option value="OTHER">Other</option>
                                </optgroup>
                            </select>
                        </div>

                        {/* Status Control: Excludes 'AVAILABLE' from manual selection */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Status *</label>
                            {isEditMode ? (
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                                >
                                    {/* If item is currently AVAILABLE, keep it viewable/locked; otherwise allow switching between MAINTENANCE or IN_USE (managed via assign/return) */}
                                    {formData.status === 'AVAILABLE' && (
                                        <option value="AVAILABLE">Available (Managed via Return)</option>
                                    )}
                                    <option value="IN_USE">In Use</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value="Available (Auto-assigned)"
                                    disabled
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-emerald-400 font-medium cursor-not-allowed"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="e.g. Apple, Dell"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Model</label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="e.g. M3 Max, U2723QE"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Serial Number / Asset Tag *</label>
                            <input
                                type="text"
                                name="serialNumber"
                                value={formData.serialNumber}
                                onChange={handleChange}
                                required
                                placeholder="Enter physical serial number or vendor asset tag..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{isEditMode ? 'Save Changes' : 'Register Equipment'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}