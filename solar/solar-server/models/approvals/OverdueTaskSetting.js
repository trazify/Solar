import mongoose from 'mongoose';

const overdueTaskSettingSchema = new mongoose.Schema({
    todayTasksDays: {
        type: Number,
        default: 0
    },
    todayPriority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    showTodayTasks: {
        type: Boolean,
        default: true
    },
    pendingMinDays: {
        type: Number,
        default: 1
    },
    pendingMaxDays: {
        type: Number,
        default: 7
    },
    sendPendingReminders: {
        type: Boolean,
        default: true
    },
    reminderFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'biweekly'],
        default: 'weekly'
    },
    overdueDays: {
        type: Number,
        default: 1
    },
    escalationLevels: [{
        level: Number,
        name: String,
        fromDay: { type: Number, required: true },
        toDay: { type: Number }, // If null, means 'and above'
        escalateTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Designation'
        },
        penaltyPercentage: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true }
    }],
    autoPenalty: {
        type: Boolean,
        default: true
    },
    penaltyPercentage: {
        type: Number,
        default: 2
    },
    overdueBenchmark: {
        type: Number,
        default: 70
    },
    countries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    }],
    states: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    }],
    clusters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cluster'
    }],
    districts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    }],
    departments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }]
}, {
    timestamps: true
});

const OverdueTaskSetting = mongoose.model('OverdueTaskSetting', overdueTaskSettingSchema);
export default OverdueTaskSetting;
