import * as React from "react";
import { cn } from "@/lib/utils";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PaginationShadcnProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (limit: number) => void;
    showItemsPerPage?: boolean;
    showInfo?: boolean;
    maxVisiblePages?: number;
    className?: string;
    previousLabel?: string;
    nextLabel?: string;
    itemsPerPageOptions?: number[];
    infoTemplate?: string;
}

export default function PaginationShadcn({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    showItemsPerPage = true,
    showInfo = true,
    maxVisiblePages = 5,
    className,
    previousLabel = "Trước",
    nextLabel = "Sau",
    itemsPerPageOptions = [5, 10, 20, 50],
    infoTemplate = "Hiển thị {start} - {end} trong tổng số {total} mục",
}: PaginationShadcnProps) {
    // Calculate visible page numbers
    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, currentPage + halfVisible);

        // Adjust if we're near the beginning or end
        if (currentPage <= halfVisible) {
            endPage = Math.min(totalPages, maxVisiblePages);
        }
        if (currentPage > totalPages - halfVisible) {
            startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        // Add first page
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push("...");
            }
        }

        // Add visible pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push("...");
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const formatInfo = () => {
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);

        return infoTemplate
            .replace("{start}", startItem.toString())
            .replace("{end}", endItem.toString())
            .replace("{total}", totalItems.toString());
    };

    const visiblePages = getVisiblePages();

    // Show pagination if there are items and either multiple pages or items per page selector
    const shouldShowPagination = totalItems > 0 && (totalPages > 1 || (showItemsPerPage && onItemsPerPageChange));

    if (!shouldShowPagination) {
        return null;
    }

    return (
        <div className={cn("flex flex-col space-y-4", className)}>
            {/* Info and Items per page */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                {showInfo && (
                    <div className="text-sm text-muted-foreground">
                        {formatInfo()}
                    </div>
                )}

                {showItemsPerPage && onItemsPerPageChange && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Hiển thị:</span>
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {itemsPerPageOptions.map((option) => (
                                    <SelectItem key={option} value={option.toString()}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">mục</span>
                    </div>
                )}
            </div>

            {/* Pagination - only show if multiple pages */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                                className={cn(
                                    currentPage <= 1 && "pointer-events-none opacity-50"
                                )}
                            >
                                {previousLabel}
                            </PaginationPrevious>
                        </PaginationItem>

                        {visiblePages.map((page, index) => (
                            <PaginationItem key={index}>
                                {page === "..." ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        onClick={() => onPageChange(page as number)}
                                        isActive={page === currentPage}
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                                className={cn(
                                    currentPage >= totalPages && "pointer-events-none opacity-50"
                                )}
                            >
                                {nextLabel}
                            </PaginationNext>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
