import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { UserSubscriptionPlan } from "@/interfaces/IUserSubscriptionPlan";
import {
  fetchUserSubscriptionPlans,
  createUserSubscriptionPlan,
  updateUserSubscriptionPlan,
  deleteUserSubscriptionPlan,
} from "@/services/features/userSubscriptions/userSubscriptionPlansSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type UpsertPayload = {
  name: string;
  description?: string;
  price: number;
  currency: string;
  billing_cycle: "monthly" | "yearly";
  duration_months: number;
  status: "active" | "inactive" | "archived";
  popular: boolean;
  display_order: number;
};

const defaultForm: UpsertPayload = {
  name: "",
  description: "",
  price: 0,
  currency: "VND",
  billing_cycle: "monthly",
  duration_months: 1,
  status: "active",
  popular: false,
  display_order: 0,
};

export default function UserSubscriptionPlanManagement() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { plans, isLoading, error } = useAppSelector(
    (s) => s.userSubscriptionPlans,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<UserSubscriptionPlan | null>(null);
  const [form, setForm] = useState<UpsertPayload>(defaultForm);

  useEffect(() => {
    dispatch(fetchUserSubscriptionPlans());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({ title: "Lỗi", description: error, variant: "destructive" });
    }
  }, [error, toast]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setIsOpen(true);
  };

  const openEdit = (plan: UserSubscriptionPlan) => {
    setEditing(plan);
    setForm({
      name: plan.name,
      description: plan.description || "",
      price: plan.price,
      currency: plan.currency,
      billing_cycle: plan.billing_cycle,
      duration_months: plan.duration_months,
      status: plan.status,
      popular: plan.popular,
      display_order: plan.display_order,
    });
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onSubmit = async () => {
    try {
      if (editing) {
        const res = await dispatch(
          updateUserSubscriptionPlan({
            planId: editing._id,
            data: form,
          }),
        ).unwrap();
        toast({ title: "Cập nhật thành công", description: res.name });
      } else {
        const res = await dispatch(
          createUserSubscriptionPlan(form),
        ).unwrap();
        toast({
          title: "Tạo gói subscription thành công",
          description: res.name,
        });
      }
      setIsOpen(false);
    } catch (e: any) {
      toast({
        title: "Thất bại",
        description: e || "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };

  const onDelete = async (plan: UserSubscriptionPlan) => {
    if (!confirm(`Bạn có chắc muốn xóa gói "${plan.name}"?`)) {
      return;
    }
    try {
      await dispatch(
        deleteUserSubscriptionPlan({ planId: plan._id }),
      ).unwrap();
      toast({ title: "Đã xóa", description: plan.name });
    } catch (e: any) {
      toast({
        title: "Xóa thất bại",
        description: e || "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };

  const header = useMemo(
    () => [
      "Tên",
      "Mô tả",
      "Giá",
      "Chu kỳ",
      "Thời hạn (tháng)",
      "Trạng thái",
      "Phổ biến",
      "Thứ tự",
      "Hành động",
    ],
    [],
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Quản lý gói Subscription</h1>
        <Button onClick={openCreate} disabled={isLoading}>
          Tạo gói Subscription
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Danh sách gói subscription cho người dùng</TableCaption>
          <TableHeader>
            <TableRow>
              {header.map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={header.length} className="text-center py-8">
                  Chưa có gói subscription nào
                </TableCell>
              </TableRow>
            ) : (
              plans.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {p.description || "-"}
                  </TableCell>
                  <TableCell>
                    {p.price.toLocaleString()} {p.currency}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.billing_cycle}</Badge>
                  </TableCell>
                  <TableCell>{p.duration_months}</TableCell>
                  <TableCell>
                    {p.status === "active" ? (
                      <Badge className="bg-emerald-500 text-white border-transparent">
                        active
                      </Badge>
                    ) : p.status === "inactive" ? (
                      <Badge variant="secondary">inactive</Badge>
                    ) : (
                      <Badge variant="outline">archived</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {p.popular ? (
                      <Badge className="bg-yellow-500 text-white border-transparent">
                        ⭐ Phổ biến
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{p.display_order}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEdit(p)}
                      disabled={isLoading}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(p)}
                      disabled={isLoading}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Cập nhật gói Subscription" : "Tạo gói Subscription"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Premium Monthly"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Mô tả
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Gói premium hàng tháng với đầy đủ tính năng"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Giá <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                className="col-span-3"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
                min="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tiền tệ</Label>
              <div className="col-span-3">
                <Select
                  value={form.currency}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, currency: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tiền tệ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VND">VND</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Chu kỳ thanh toán <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Select
                  value={form.billing_cycle}
                  onValueChange={(v: "monthly" | "yearly") =>
                    setForm((f) => ({ ...f, billing_cycle: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chu kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">monthly</SelectItem>
                    <SelectItem value="yearly">yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Thời hạn (tháng) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="duration"
                type="number"
                className="col-span-3"
                value={form.duration_months}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    duration_months: Number(e.target.value),
                  }))
                }
                min="1"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Trạng thái</Label>
              <div className="col-span-3">
                <Select
                  value={form.status}
                  onValueChange={(
                    v: "active" | "inactive" | "archived",
                  ) => setForm((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="inactive">inactive</SelectItem>
                    <SelectItem value="archived">archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="popular" className="text-right">
                Phổ biến
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="popular"
                  checked={form.popular}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({ ...f, popular: checked }))
                  }
                />
                <Label htmlFor="popular" className="text-sm text-muted-foreground">
                  Đánh dấu là gói phổ biến
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="display_order" className="text-right">
                Thứ tự hiển thị
              </Label>
              <Input
                id="display_order"
                type="number"
                className="col-span-3"
                value={form.display_order}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    display_order: Number(e.target.value),
                  }))
                }
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              onClick={onSubmit}
              disabled={
                isLoading ||
                !form.name ||
                !form.price ||
                !form.billing_cycle ||
                !form.duration_months
              }
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

