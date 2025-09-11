import { Trophy, Users, Mail, Phone, MapPin, Github, Linkedin, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-muted/50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-competition text-competition-foreground">
                <Trophy className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold gradient-text">Contest Buddy</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nền tảng cuộc thi hàng đầu Việt Nam, kết nối thí sinh với những cơ hội thi đấu chất lượng 
              và xây dựng cộng đồng học tập sôi động.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tính năng nền tảng</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Tìm kiếm cuộc thi
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-foreground transition-colors">
                  Kết nối cộng đồng
                </Link>
              </li>
              <li>
                <Link to="/teams" className="hover:text-foreground transition-colors">
                  Quản lý nhóm thi
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="hover:text-foreground transition-colors">
                  Lịch thi cá nhân
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-foreground transition-colors">
                  Hồ sơ thí sinh
                </Link>
              </li>
            </ul>
          </div>

          {/* Competition Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Danh mục cuộc thi</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/?category=programming" className="hover:text-foreground transition-colors">
                  Lập trình & Công nghệ
                </Link>
              </li>
              <li>
                <Link to="/?category=design" className="hover:text-foreground transition-colors">
                  Thiết kế & Sáng tạo
                </Link>
              </li>
              <li>
                <Link to="/?category=startup" className="hover:text-foreground transition-colors">
                  Khởi nghiệp & Kinh doanh
                </Link>
              </li>
              <li>
                <Link to="/?category=science" className="hover:text-foreground transition-colors">
                  Khoa học & Nghiên cứu
                </Link>
              </li>
              <li>
                <Link to="/?category=mathematics" className="hover:text-foreground transition-colors">
                  Toán học & Logic
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Liên hệ</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@contestbuddy.vn</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2 items-start">
                <MapPin className="h-4 w-4 mt-1" />
                <span className="break-words whitespace-normal">
                  Đông Hoà, Dĩ An, Bình Dương
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Contest Buddy.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">
                Về chúng tôi
              </Link>
              <a href="#" className="hover:text-foreground transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 