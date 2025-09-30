import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { verifyEmail, clearError } from "@/services/features/auth/authSlice";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function EmailVerification() {
    const { token: pathToken } = useParams<{ token: string }>();
    const [searchParams] = useSearchParams();
    const queryToken = searchParams.get('token');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    const { toast } = useToast();

    // Get token from either path parameter or query parameter
    const token = pathToken || queryToken;

    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
    const [message, setMessage] = useState(''); useEffect(() => {
        if (token) {
            handleVerifyEmail();
        } else {
            setVerificationStatus('error');
            setMessage('Token xác thực không hợp lệ');
        }

        // Clear any previous errors
        dispatch(clearError());

        return () => {
            dispatch(clearError());
        };
    }, [token, dispatch]);

    const handleVerifyEmail = async () => {
        if (!token) return;

        try {
            const result = await dispatch(verifyEmail({ token })).unwrap();

            if (result.success) {
                setVerificationStatus('success');
                setMessage('Email đã được xác thực thành công!');
                toast({
                    title: "Thành công!",
                    description: "Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay bây giờ.",
                });

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setVerificationStatus('error');
                setMessage(result.message || 'Xác thực email thất bại');
                toast({
                    title: "Lỗi",
                    description: result.message || 'Xác thực email thất bại',
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            setVerificationStatus('error');
            setMessage(error || 'Đã xảy ra lỗi khi xác thực email');
            toast({
                title: "Lỗi",
                description: error || 'Đã xảy ra lỗi khi xác thực email',
                variant: "destructive",
            });
        }
    };

    const renderContent = () => {
        switch (verificationStatus) {
            case 'pending':
                return (
                    <>
                        <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Đang xác thực email...
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Vui lòng chờ trong khi chúng tôi xác thực email của bạn.
                        </p>
                    </>
                );

            case 'success':
                return (
                    <>
                        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Xác thực thành công!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Bạn sẽ được chuyển hướng đến trang đăng nhập trong 3 giây...
                        </p>
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full"
                        >
                            Đăng nhập ngay
                        </Button>
                    </>
                );

            case 'error':
                return (
                    <>
                        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Xác thực thất bại
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>
                        <div className="space-y-3">
                            <Button
                                onClick={() => navigate('/resend-verification')}
                                className="w-full"
                                variant="outline"
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Gửi lại email xác thực
                            </Button>
                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full"
                            >
                                Quay lại đăng nhập
                            </Button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">CB</span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-700">Contest Buddy</h2>
                    </div>

                    {renderContent()}

                    {/* Back to home link */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <Link
                            to="/"
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Quay về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}