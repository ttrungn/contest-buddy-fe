import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const TAG_OPTIONS = [
    "React", "Next.js", "Vue", "Nuxt", "Angular", "Svelte", "SolidJS", "Node.js", "Express", "NestJS", "Fastify", "Laravel", "Django", "Flask", "Spring Boot", "Ruby on Rails", "Go", "Fiber", "Gin", "ASP.NET Core", "PHP", "Java", "Kotlin", "Swift", "Objective-C", "Python", "TypeScript", "JavaScript", "C#", "C++", "C", "Rust", "Elixir", "Flutter", "React Native", "Ionic", "TailwindCSS", "Bootstrap", "GraphQL", "Apollo", "Redux", "Zustand", "Vuex", "Pinia"
];

export interface ProjectFormState {
    title: string;
    description: string;
    category: string;
    project_url: string;
    github_url: string;
    image: File | null;
}

interface ProjectModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: { formData: FormData; projectId?: string }) => Promise<void> | void;
    initial?: Partial<ProjectFormState>;
    initialTags?: string[];
    projectId?: string | null;
}

export default function ProjectModal({ open, onClose, onSubmit, initial, initialTags = [], projectId }: ProjectModalProps) {
    const [form, setForm] = useState<ProjectFormState>({
        title: "",
        description: "",
        category: "",
        project_url: "",
        github_url: "",
        image: null,
    });
    const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
    const [tagSearch, setTagSearch] = useState("");

    useEffect(() => {
        if (open) {
            setForm({
                title: initial?.title || "",
                description: initial?.description || "",
                category: initial?.category || "",
                project_url: initial?.project_url || "",
                github_url: initial?.github_url || "",
                image: null,
            });
            setSelectedTags(initialTags);
            setTagSearch("");
        }
    }, [open, initial, initialTags]);

    const filteredTags = useMemo(() => TAG_OPTIONS.filter(t => t.toLowerCase().includes(tagSearch.toLowerCase())), [tagSearch]);

    const handleSubmit = async () => {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("category", form.category);
        if (selectedTags.length) fd.append("tags", JSON.stringify(selectedTags));
        if (form.project_url) fd.append("project_url", form.project_url);
        if (form.github_url) fd.append("github_url", form.github_url);
        if (form.image) fd.append("image", form.image);
        await onSubmit({ formData: fd, projectId: projectId || undefined });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{projectId ? "Cập nhật dự án" : "Thêm dự án"}</DialogTitle>
                    <DialogDescription>Thêm/Sửa dự án Portfolio</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="p_title">Tiêu đề</Label>
                            <Input id="p_title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My Awesome Project" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="p_desc">Mô tả</Label>
                            <Textarea id="p_desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Project description" className="min-h-[140px]" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="p_cat">Danh mục</Label>
                                <Input id="p_cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Web Development" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="p_img">Hình ảnh</Label>
                                <Input id="p_img" type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="p_demo">Project URL</Label>
                                <Input id="p_demo" value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} placeholder="https://example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="p_git">Github URL</Label>
                                <Input id="p_git" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/username/repo" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tags</Label>
                            <Input value={tagSearch} onChange={(e) => setTagSearch(e.target.value)} placeholder="Tìm kiếm tag..." />
                            <ScrollArea className="h-48 border rounded-md p-3">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {filteredTags.map(tag => (
                                        <label key={tag} className="flex items-center gap-2 text-sm">
                                            <Checkbox
                                                checked={selectedTags.includes(tag)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedTags(prev => checked ? [...prev, tag] : prev.filter(x => x !== tag));
                                                }}
                                            />
                                            {tag}
                                        </label>
                                    ))}
                                </div>
                            </ScrollArea>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {selectedTags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button onClick={handleSubmit} disabled={!form.title || !form.description}>{projectId ? "Cập nhật" : "Thêm"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}


