import { useState, useEffect, useCallback } from "react";
import {
    Settings as SettingsIcon,
    Bell,
    Mail,
    Smartphone,
    Trophy,
    Users,
    Clock,
    Check,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import {
    fetchNotificationSettings,
    updateNotificationSettings,
    selectNotificationSettings,
    selectNotificationLoading,
    selectNotificationError,
    selectNotificationUpdating,
} from "@/services/features/notifications/notificationSlice";
import { UpdateNotificationSettingsRequest } from "@/interfaces/INotification";

const reminderTimingOptions = [
    { value: "1-hour", label: "1 giờ trước" },
    { value: "3-hours", label: "3 giờ trước" },
    { value: "1-day", label: "1 ngày trước" },
    { value: "3-days", label: "3 ngày trước" },
    { value: "1-week", label: "1 tuần trước" },
];

export default function Settings() {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(selectNotificationSettings);
    const isLoading = useAppSelector(selectNotificationLoading);
    const error = useAppSelector(selectNotificationError);
    const isUpdating = useAppSelector(selectNotificationUpdating);

    const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    // Load settings on component mount
    useEffect(() => {
        dispatch(fetchNotificationSettings());
    }, [dispatch]);

    // Auto-update function with debouncing
    const autoUpdateSettings = useCallback(async (newSettings: UpdateNotificationSettingsRequest) => {
        try {
            await dispatch(updateNotificationSettings(newSettings)).unwrap();
            setLastUpdateTime(new Date());
            setUpdateSuccess(true);
            // Hide success message after 2 seconds
            setTimeout(() => setUpdateSuccess(false), 2000);
        } catch (error) {
            console.error("Failed to update settings:", error);
        }
    }, [dispatch]);

    const handleToggleChange = (field: keyof UpdateNotificationSettingsRequest, value: boolean) => {
        if (!settings) return;

        const newSettings: UpdateNotificationSettingsRequest = {
            email_notifications: settings.email_notifications,
            push_notifications: settings.push_notifications,
            reminder_timings: settings.reminder_timings,
            competition_updates: settings.competition_updates,
            achievement_sharing: settings.achievement_sharing,
            collaboration_requests: settings.collaboration_requests,
            [field]: value,
        };

        autoUpdateSettings(newSettings);
    };

    const handleReminderTimingChange = (timing: string) => {
        if (!settings) return;

        const newSettings: UpdateNotificationSettingsRequest = {
            email_notifications: settings.email_notifications,
            push_notifications: settings.push_notifications,
            reminder_timings: [timing], // Chỉ chọn 1 thời gian
            competition_updates: settings.competition_updates,
            achievement_sharing: settings.achievement_sharing,
            collaboration_requests: settings.collaboration_requests,
        };

        autoUpdateSettings(newSettings);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Đang tải cài đặt...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Cài đặt</h1>
                    <p className="text-muted-foreground">
                        Quản lý thông báo và tùy chọn cá nhân. Thay đổi sẽ được lưu tự động.
                    </p>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {updateSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <p className="text-green-700">Cài đặt đã được lưu thành công!</p>
                    </div>
                )}

                {isUpdating && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <p className="text-blue-700">Đang lưu cài đặt...</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Thông báo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <Label htmlFor="email-notifications" className="text-base font-medium">
                                            Thông báo email
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Nhận thông báo qua email
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id="email-notifications"
                                    checked={settings?.email_notifications || false}
                                    onCheckedChange={(checked) => handleToggleChange('email_notifications', checked)}
                                    disabled={isUpdating}
                                />
                            </div>

                            {/* Push Notifications */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="h-5 w-5 text-green-500" />
                                    <div>
                                        <Label htmlFor="push-notifications" className="text-base font-medium">
                                            Thông báo đẩy
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Nhận thông báo trên thiết bị
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id="push-notifications"
                                    checked={settings?.push_notifications || false}
                                    onCheckedChange={(checked) => handleToggleChange('push_notifications', checked)}
                                    disabled={isUpdating}
                                />
                            </div>

                            {/* Competition Updates */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Trophy className="h-5 w-5 text-purple-500" />
                                    <div>
                                        <Label htmlFor="competition-updates" className="text-base font-medium">
                                            Cập nhật cuộc thi
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Thông báo về cuộc thi đã đăng ký
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id="competition-updates"
                                    checked={settings?.competition_updates || false}
                                    onCheckedChange={(checked) => handleToggleChange('competition_updates', checked)}
                                    disabled={isUpdating}
                                />
                            </div>

                            {/* Achievement Sharing */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                    <div>
                                        <Label htmlFor="achievement-sharing" className="text-base font-medium">
                                            Chia sẻ thành tích
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Thông báo khi có thành tích mới
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id="achievement-sharing"
                                    checked={settings?.achievement_sharing || false}
                                    onCheckedChange={(checked) => handleToggleChange('achievement_sharing', checked)}
                                    disabled={isUpdating}
                                />
                            </div>

                            {/* Collaboration Requests */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-orange-500" />
                                    <div>
                                        <Label htmlFor="collaboration-requests" className="text-base font-medium">
                                            Yêu cầu hợp tác
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Thông báo về lời mời hợp tác
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id="collaboration-requests"
                                    checked={settings?.collaboration_requests || false}
                                    onCheckedChange={(checked) => handleToggleChange('collaboration_requests', checked)}
                                    disabled={isUpdating}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reminder Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Thời gian nhắc nhở
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Chọn thời gian nhắc nhở trước khi cuộc thi bắt đầu
                            </p>
                            <RadioGroup
                                value={settings?.reminder_timings?.[0] || ""}
                                onValueChange={handleReminderTimingChange}
                                disabled={isUpdating}
                                className="space-y-3"
                            >
                                {reminderTimingOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={option.value}
                                            id={option.value}
                                        />
                                        <Label htmlFor={option.value} className="text-sm cursor-pointer">
                                            {option.label}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>

                {/* Last Update Info */}
                {lastUpdateTime && (
                    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-gray-500" />
                            <p className="text-gray-600 text-sm">
                                Cập nhật lần cuối: {lastUpdateTime.toLocaleTimeString('vi-VN')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
