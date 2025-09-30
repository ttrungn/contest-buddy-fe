import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Shield } from "lucide-react";

export default function Unauthorized() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white shadow-2xl rounded-2xl p-8 border border-red-100">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <Shield className="w-10 h-10 text-red-600" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Không có quyền truy cập
                    </h1>

                    {/* Description */}
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên
                        nếu bạn cho rằng đây là lỗi.
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleGoBack}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại trang trước
                        </button>

                        <button
                            onClick={handleGoHome}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg"
                        >
                            <Home className="w-4 h-4" />
                            Về trang chủ
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Mã lỗi: <span className="font-mono text-red-600">403</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}