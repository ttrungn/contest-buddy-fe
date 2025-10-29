import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { Plan } from "@/interfaces/IPlan";
import { fetchPlans, createPlan, updatePlan, deletePlan } from "@/services/features/plans/plansSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

type UpsertPayload = {
    name: string;
    description: string;
    price_amount: number;
    currency: string;
    status: "active" | "inactive";
};

const defaultForm: UpsertPayload = {
    name: "",
    description: "",
    price_amount: 0,
    currency: "VND",
    status: "active",
};

export default function PlanManagement() {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const { plans, isLoading, error } = useAppSelector((s) => s.plans);

    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<Plan | null>(null);
    const [form, setForm] = useState<UpsertPayload>(defaultForm);

    useEffect(() => {
        dispatch(fetchPlans());
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

    const openEdit = (plan: Plan) => {
        setEditing(plan);
        setForm({
            name: plan.name,
            description: plan.description,
            price_amount: plan.price_amount,
            currency: plan.currency,
            status: plan.status,
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
                    updatePlan({ id: editing.id, data: form }),
                ).unwrap();
                toast({ title: "Cập nhật thành công", description: res.name });
            } else {
                const res = await dispatch(createPlan(form)).unwrap();
                toast({ title: "Tạo gói thành công", description: res.name });
            }
            setIsOpen(false);
        } catch (e: any) {
            toast({ title: "Thất bại", description: e, variant: "destructive" });
        }
    };

    const onDelete = async (plan: Plan) => {
        try {
            await dispatch(deletePlan({ id: plan.id })).unwrap();
            toast({ title: "Đã xóa", description: plan.name });
        } catch (e: any) {
            toast({ title: "Xóa thất bại", description: e, variant: "destructive" });
        }
    };

    const header = useMemo(
        () => ["Tên", "Mô tả", "Giá", "Tiền tệ", "Trạng thái", "Hành động"],
        [],
    );

    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Quản lý gói (Plans)</h1>
                <Button onClick={openCreate} disabled={isLoading}>Tạo gói</Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableCaption>Danh sách gói hiện có</TableCaption>
                    <TableHeader>
                        <TableRow>
                            {header.map((h) => (
                                <TableHead key={h}>{h}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium">{p.name}</TableCell>
                                <TableCell className="max-w-[360px] truncate">{p.description}</TableCell>
                                <TableCell>{p.price_amount.toLocaleString()}</TableCell>
                                <TableCell>{p.currency}</TableCell>
                                <TableCell>
                                    {p.status === "active" ? (
                                        <Badge className="bg-emerald-500 text-white border-transparent">active</Badge>
                                    ) : (
                                        <Badge variant="secondary">inactive</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="space-x-2">
                                    <Button size="sm" variant="secondary" onClick={() => openEdit(p)} disabled={isLoading}>Sửa</Button>
                                    <Button size="sm" variant="destructive" onClick={() => onDelete(p)} disabled={isLoading}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <span />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Cập nhật gói" : "Tạo gói"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Tên</Label>
                            <Input id="name" className="col-span-3" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Mô tả</Label>
                            <Input id="description" className="col-span-3" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Giá</Label>
                            <Input id="price" type="number" className="col-span-3" value={form.price_amount} onChange={(e) => setForm((f) => ({ ...f, price_amount: Number(e.target.value) }))} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Tiền tệ</Label>
                            <div className="col-span-3">
                                <Select value={form.currency} onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}>
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
                            <Label className="text-right">Trạng thái</Label>
                            <div className="col-span-3">
                                <Select value={form.status} onValueChange={(v: "active" | "inactive") => setForm((f) => ({ ...f, status: v }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">active</SelectItem>
                                        <SelectItem value="inactive">inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>Hủy</Button>
                        <Button onClick={onSubmit} disabled={isLoading || !form.name || !form.description || !form.currency}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}


