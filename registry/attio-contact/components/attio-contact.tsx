"use client";

import { Input } from "@/components/ui/input";
import { AtSign, BriefcaseBusiness, Building2, GripVertical, IdCard, MapPin, Phone, Pilcrow, Plus, X, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SortableEmailItemProps {
    id: string;
    email: string;
    index: number;
    onUpdate: (index: number, value: string) => void;
    onRemove: (index: number) => void;
}

function SortableEmailItem({ id, email, index, onUpdate, onRemove }: SortableEmailItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-row gap-1 items-center"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="size-4 shrink-0" strokeWidth={1.5} />
            </div>
            <Input 
                className="text-xs flex-1" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => onUpdate(index, e.target.value)}
            />
            <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onRemove(index)}
            >
                <X className="size-3" strokeWidth={1.5} />
            </Button>
        </div>
    );
}

interface SortablePhoneItemProps {
    id: string;
    phone: string;
    index: number;
    onUpdate: (index: number, value: string) => void;
    onRemove: (index: number) => void;
}

function SortablePhoneItem({ id, phone, index, onUpdate, onRemove }: SortablePhoneItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-row gap-1 items-center"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="size-4 shrink-0" strokeWidth={1.5} />
            </div>
            <Input 
                className="text-xs flex-1" 
                placeholder="+1 (555) 123-4567" 
                value={phone}
                onChange={(e) => onUpdate(index, e.target.value)}
            />
            <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onRemove(index)}
            >
                <X className="size-3" strokeWidth={1.5} />
            </Button>
        </div>
    );
}

export default function AttioContact() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emails, setEmails] = useState<string[]>([]);
    const [phones, setPhones] = useState<string[]>([]);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [company, setCompany] = useState("");
    const [companyOpen, setCompanyOpen] = useState(false);
    const [addCompanyDialogOpen, setAddCompanyDialogOpen] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState("");
    const [newCompanyDescription, setNewCompanyDescription] = useState("");
    const [description, setDescription] = useState("");
    const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
    const [linkedin, setLinkedin] = useState("");

    // Sample companies list - in a real app this would come from an API
    const [companies, setCompanies] = useState([
        "Acme Corporation",
        "Apple Inc.",
        "Google LLC",
        "Microsoft Corporation",
        "Amazon.com Inc.",
        "Meta Platforms Inc.",
        "Tesla Inc.",
        "Netflix Inc.",
        "Salesforce Inc.",
        "Adobe Inc.",
        "Spotify Technology S.A.",
        "Stripe Inc.",
        "Shopify Inc.",
        "Zoom Video Communications",
        "Slack Technologies",
        "Atlassian Corporation",
        "Dropbox Inc.",
        "Twitter Inc.",
        "LinkedIn Corporation",
        "Uber Technologies Inc."
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const getDisplayName = () => {
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName || "Set Name...";
    };

    const getDisplayLinkedin = () => {
        if (!linkedin) return "Set LinkedIn...";
        
        // Extract username from LinkedIn URL
        const match = linkedin.match(/linkedin\.com\/in\/([^\/\?]+)/);
        if (match) {
            return <Badge variant="blue" className="text-sm">@{match[1]}</Badge>;
        }
        
        // If it's not a full URL, just display as is
        return linkedin;
    };

    const getDisplayLocation = () => {
        const fullLocation = `${city}${city && state ? ', ' : ''}${state}`.trim();
        return fullLocation || "Set Primary Location...";
    };

    const getDisplayEmails = () => {
        if (emails.length === 0) return "Set Email addresses...";
        if (emails.length === 1) return <Badge variant="blue" className="text-sm">{emails[0]}</Badge>;
        return (
            <div className="flex items-center gap-2">
                <Badge variant="blue" className="text-sm">{emails[0]}</Badge>
                <Badge variant="gray" className="text-xs">
                    +{emails.length - 1}
                </Badge>
            </div>
        );
    };

    const getDisplayPhones = () => {
        if (phones.length === 0) return "Set Phone numbers...";
        if (phones.length === 1) return <Badge variant="blue" className="text-sm">{phones[0]}</Badge>;
        return (
            <div className="flex items-center gap-2">
                <Badge variant="blue" className="text-sm">{phones[0]}</Badge>
                <Badge variant="gray" className="text-xs">
                    +{phones.length - 1}
                </Badge>
            </div>
        );
    };

    const addEmail = () => {
        setEmails([...emails, ""]);
    };

    const updateEmail = (index: number, value: string) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    const removeEmail = (index: number) => {
        const newEmails = emails.filter((_, i) => i !== index);
        setEmails(newEmails);
    };

    const addPhone = () => {
        setPhones([...phones, ""]);
    };

    const updatePhone = (index: number, value: string) => {
        const newPhones = [...phones];
        newPhones[index] = value;
        setPhones(newPhones);
    };

    const removePhone = (index: number) => {
        const newPhones = phones.filter((_, i) => i !== index);
        setPhones(newPhones);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setEmails((items) => {
                const oldIndex = items.findIndex((_, index) => `email-${index}` === active.id);
                const newIndex = items.findIndex((_, index) => `email-${index}` === over?.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handlePhoneDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setPhones((items) => {
                const oldIndex = items.findIndex((_, index) => `phone-${index}` === active.id);
                const newIndex = items.findIndex((_, index) => `phone-${index}` === over?.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleCreateCompany = () => {
        if (newCompanyName.trim()) {
            setCompanies([...companies, newCompanyName.trim()]);
            setCompany(newCompanyName.trim());
            setNewCompanyName("");
            setNewCompanyDescription("");
            setAddCompanyDialogOpen(false);
            setCompanyOpen(false);
        }
    };

    const handleAddCompanyDialogKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setAddCompanyDialogOpen(false);
            setNewCompanyName("");
            setNewCompanyDescription("");
        } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleCreateCompany();
        }
    };

    return (
        <div className="flex flex-col gap-2 text-foreground">
            <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm w-[10rem]">
                    <IdCard className="size-4 shrink-0" strokeWidth={1.5} />
                    <span className="whitespace-nowrap">Name</span>
                </div>
                <div className="w-full">
                <Popover>
                    <PopoverTrigger className={cn(
                        "w-full text-left hover:bg-secondary rounded-md py-2 px-2",
                        !firstName && !lastName && "text-muted-foreground/80"
                    )}>
                        {getDisplayName()}
                    </PopoverTrigger>
                    <PopoverContent className="p-3" align="start">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1 ">
                                <div className="text-xs text-muted-foreground">First Name</div>
                                <Input 
                                    className="text-xs" 
                                    placeholder="Enter first name..." 
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-xs text-muted-foreground">Last Name</div>
                                <Input 
                                    className="text-xs" 
                                    placeholder="Enter last name.." 
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm w-[10rem]">
                    <AtSign className="size-4 shrink-0" strokeWidth={1.5} />
                    <span className="whitespace-nowrap">Email</span>
                </div>
                <div className="w-full">
                <Popover>
                    <PopoverTrigger className={cn(
                        "w-full text-left hover:bg-secondary rounded-md py-2 px-2",
                        emails.length === 0 && "text-muted-foreground/80"
                    )}>
                        {getDisplayEmails()}
                    </PopoverTrigger>
                    <PopoverContent className="p-3" align="start">
                        <div className="flex flex-col gap-3">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={emails.map((_, index) => `email-${index}`)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {emails.map((email, index) => (
                                        <SortableEmailItem
                                            key={`email-${index}`}
                                            id={`email-${index}`}
                                            email={email}
                                            index={index}
                                            onUpdate={updateEmail}
                                            onRemove={removeEmail}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                            <Button 
                                variant="secondary" 
                                className="flex flex-row gap-1 items-center justify-start"
                                onClick={addEmail}
                            >
                                <Plus className="size-4 shrink-0" strokeWidth={1.5} />
                                <span className="text-xs">Add Email</span>
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
                </div>
            </div>
    
            <div className="flex items-start gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm w-[10rem] pt-2">
                    <Pilcrow className="size-4 shrink-0" strokeWidth={1.5} />
                    <span className="whitespace-nowrap">Description</span>
                </div>
                <textarea 
                    className={cn(
                        "w-full text-left hover:bg-secondary rounded-md py-2 px-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-9",
                        !isDescriptionFocused && "overflow-hidden whitespace-nowrap text-ellipsis"
                    )}
                    placeholder="Set Description..."
                    rows={1}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={(e) => {
                        setIsDescriptionFocused(true);
                        setTimeout(() => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = Math.max(36, target.scrollHeight) + 'px';
                        }, 0);
                    }}
                    onBlur={(e) => {
                        setIsDescriptionFocused(false);
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = '36px';
                    }}
                    onInput={(e) => {
                        if (isDescriptionFocused) {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = Math.max(36, target.scrollHeight) + 'px';
                        }
                    }}
                    style={{
                        height: isDescriptionFocused ? 'auto' : '36px'
                    }}
                />
            </div>
            <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm w-[10rem]">
                    <Building2 className="size-4 shrink-0" strokeWidth={1.5} />
                    <span className="whitespace-nowrap">Company</span>
                </div>
                <div className="w-full">
                    <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                        <PopoverTrigger className={cn(
                            "w-full text-left hover:bg-secondary rounded-md py-2 px-2",
                            !company && "text-muted-foreground/80"
                        )}>
                            {company ? <Badge variant="outline" className="text-sm">{company}</Badge> : "Set Company..."}
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Search companies..." />
                                <CommandEmpty>No company found.</CommandEmpty>
                                <CommandGroup className="max-h-48 overflow-auto">
                                    {companies.map((companyName) => (
                                        <CommandItem
                                            key={companyName}
                                            value={companyName}
                                            onSelect={(currentValue) => {
                                                setCompany(currentValue === company ? "" : currentValue);
                                                setCompanyOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    company === companyName ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {companyName}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                <div className="border-t px-1 py-1">
                                    <Button 
                                        variant="ghost" 
                                        className="w-full justify-start"
                                        onClick={() => {
                                            setCompanyOpen(false);
                                            setAddCompanyDialogOpen(true);
                                        }}
                                    >
                                        <Plus className="size-4 shrink-0" strokeWidth={1.5} />
                                        <span className="text-xs">Add Company</span>
                                    </Button>
                                </div>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm w-[10rem]">
                    <BriefcaseBusiness className="size-4 shrink-0" strokeWidth={1.5} />
                    <span className="whitespace-nowrap">Title</span>
                </div>
                <input className="w-full text-left hover:bg-secondary rounded-md py-2 px-2" placeholder="Set Job title..." />
            </div>
            <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm w-[10rem]">
                    <Phone className="size-4 shrink-0" strokeWidth={1.5} />
                    <span className="whitespace-nowrap">Phone</span>
                </div>
                <div className="w-full">
                <Popover>
                    <PopoverTrigger className={cn(
                        "w-full text-left hover:bg-secondary rounded-md py-2 px-2",
                        phones.length === 0 && "text-muted-foreground/80"
                    )}>
                        {getDisplayPhones()}
                    </PopoverTrigger>
                    <PopoverContent className="p-3" align="start">
                        <div className="flex flex-col gap-3">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handlePhoneDragEnd}
                            >
                                <SortableContext
                                    items={phones.map((_, index) => `phone-${index}`)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {phones.map((phone, index) => (
                                        <SortablePhoneItem
                                            key={`phone-${index}`}
                                            id={`phone-${index}`}
                                            phone={phone}
                                            index={index}
                                            onUpdate={updatePhone}
                                            onRemove={removePhone}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                            <Button 
                                variant="secondary" 
                                className="flex flex-row gap-1 items-center justify-start"
                                onClick={addPhone}
                            >
                                <Plus className="size-4 shrink-0" strokeWidth={1.5} />
                                <span className="text-xs">Add Phone number</span>
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
                </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm w-[10rem]">
                    <MapPin className="size-4 shrink-0" strokeWidth={1.5} />
                    <span className="whitespace-nowrap">Location</span>
                </div>
                <div className="w-full">
                <Popover>
                    <PopoverTrigger className={cn(
                        "w-full text-left hover:bg-secondary rounded-md py-2 px-2",
                        !city && !state && "text-muted-foreground/80"
                    )}>
                        {getDisplayLocation()}
                    </PopoverTrigger>
                    <PopoverContent className="p-3" align="start">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <div className="text-xs text-muted-foreground">City</div>
                                <Input 
                                    className="text-xs" 
                                    placeholder="Enter city..." 
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-xs text-muted-foreground">State</div>
                                <Input 
                                    className="text-xs" 
                                    placeholder="Enter state..." 
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm w-[10rem]">
                    <div className="border border-muted-foreground rounded size-4 flex items-center justify-center">
                        <span className="text-xs">in</span>
                    </div>
                    <span className="whitespace-nowrap">LinkedIn</span>
                </div>
                <div className="w-full">
                    <Popover>
                        <PopoverTrigger className={cn(
                            "w-full text-left hover:bg-secondary rounded-md py-2 px-2",
                            !linkedin && "text-muted-foreground/80"
                        )}>
                            {getDisplayLinkedin()}
                        </PopoverTrigger>
                        <PopoverContent className="p-3" align="start">
                            <div className="flex flex-col gap-1">
                                <div className="text-xs text-muted-foreground">LinkedIn Profile URL</div>
                                <Input 
                                    className="text-xs" 
                                    placeholder="https://www.linkedin.com/in/username" 
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <Dialog open={addCompanyDialogOpen} onOpenChange={setAddCompanyDialogOpen}>
                <DialogContent className="sm:max-w-[425px]" onKeyDown={handleAddCompanyDialogKeyDown}>
                    <DialogHeader>
                        <DialogTitle>Add New Company</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company-name">Name</Label>
                            <Input
                                id="company-name"
                                value={newCompanyName}
                                onChange={(e) => setNewCompanyName(e.target.value)}
                                placeholder="Enter company name..."
                                autoFocus
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company-description">Description</Label>
                            <Textarea
                                id="company-description"
                                value={newCompanyDescription}
                                onChange={(e) => setNewCompanyDescription(e.target.value)}
                                placeholder="Enter company description..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setAddCompanyDialogOpen(false);
                                setNewCompanyName("");
                                setNewCompanyDescription("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreateCompany} disabled={!newCompanyName.trim()}>
                            Create Record
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}