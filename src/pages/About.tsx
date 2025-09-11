import {
  Trophy,
  Users,
  Target,
  Award,
  Heart,
  Shield,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from "@/components/Footer";

export default function About() {
  const features = [
    {
      icon: Trophy,
      title: "Tìm kiếm cuộc thi",
      description: "Khám phá hàng trăm cuộc thi đa dạng từ các lĩnh vực khác nhau",
    },
    {
      icon: Users,
      title: "Kết nối cộng đồng",
      description: "Tìm kiếm bạn thi phù hợp và xây dựng mạng lưới quan hệ",
    },
    {
      icon: Target,
      title: "Quản lý nhóm",
      description: "Tạo và quản lý nhóm thi một cách hiệu quả",
    },
    {
      icon: Award,
      title: "Theo dõi thành tích",
      description: "Lưu trữ và chia sẻ thành tích thi đấu của bạn",
    },
    {
      icon: Shield,
      title: "Bảo mật thông tin",
      description: "Đảm bảo an toàn và bảo mật thông tin cá nhân",
    },
    {
      icon: Globe,
      title: "Đa nền tảng",
      description: "Truy cập từ mọi thiết bị, mọi lúc mọi nơi",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Thí sinh tham gia" },
    { number: "500+", label: "Cuộc thi đã tổ chức" },
    { number: "2,000+", label: "Nhóm thi thành công" },
    { number: "50+", label: "Đối tác tổ chức" },
  ];

  const team = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Founder",
      avatar: "",
      bio: "Chuyên gia công nghệ với 10+ năm kinh nghiệm trong lĩnh vực EdTech",
      social: {
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Trần Thị B",
      role: "CTO",
      avatar: "",
      bio: "Kỹ sư phần mềm với chuyên môn về AI/ML và phát triển web",
      social: {
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Lê Văn C",
      role: "Head of Product",
      avatar: "",
      bio: "Chuyên gia UX/UI với kinh nghiệm thiết kế sản phẩm số",
      social: {
        linkedin: "#",
        github: "#",
      },
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Đam mê",
      description: "Chúng tôi tin rằng đam mê là động lực thúc đẩy sự sáng tạo và thành công",
    },
    {
      icon: Users,
      title: "Cộng đồng",
      description: "Xây dựng một cộng đồng mạnh mẽ, hỗ trợ lẫn nhau trong hành trình thi đấu",
    },
    {
      icon: Star,
      title: "Chất lượng",
      description: "Cam kết mang đến trải nghiệm tốt nhất cho người dùng",
    },
    {
      icon: CheckCircle,
      title: "Minh bạch",
      description: "Đảm bảo tính minh bạch và công bằng trong mọi hoạt động",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-purple-500/10">
        <div className="container py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Trophy className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Về{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Contest Buddy
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Nền tảng kết nối thí sinh, tạo cơ hội thi đấu và xây dựng cộng đồng 
              học tập sôi động. Chúng tôi tin rằng mọi người đều xứng đáng có cơ hội 
              thể hiện tài năng và phát triển bản thân.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Bắt đầu ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Liên hệ chúng tôi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Sứ mệnh của chúng tôi</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Contest Buddy được thành lập với sứ mệnh tạo ra một nền tảng toàn diện 
              giúp các thí sinh dễ dàng tìm kiếm, tham gia và quản lý các cuộc thi 
              một cách hiệu quả.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Chúng tôi tin rằng mỗi cuộc thi là một cơ hội để học hỏi, phát triển 
              kỹ năng và kết nối với những người có cùng đam mê. Với Contest Buddy, 
              hành trình thi đấu của bạn sẽ trở nên dễ dàng và thú vị hơn bao giờ hết.
            </p>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Đã được tin tưởng bởi 10,000+ thí sinh
              </Badge>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tính năng nổi bật</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Khám phá những tính năng độc đáo giúp Contest Buddy trở thành 
              nền tảng hàng đầu cho cộng đồng thi đấu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những giá trị định hướng mọi quyết định và hành động của chúng tôi
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Những con người tài năng và tâm huyết đứng sau Contest Buddy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xl">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bạn có câu hỏi hoặc góp ý? Chúng tôi luôn sẵn sàng lắng nghe!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">contact@contestbuddy.vn</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Điện thoại</h3>
              <p className="text-muted-foreground">+84 123 456 789</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Địa chỉ</h3>
              <p className="text-muted-foreground">Đông Hoà, Dĩ An, Bình Dương</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 