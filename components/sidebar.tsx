import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "@/components/sidebar-item";
import { Loader } from "lucide-react";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";

type Props = {
    className?: string;
};

export const Sidebar = ({className}: Props) => {
    return (
        <div className={cn("flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col", className)}>
            <Link href="/learn">
                <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
                    <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                        <Image src="/duoMascot.svg" height={40} width={40} alt="Mascot"/>
                    </div>
                    <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
                        Lingo
                    </h1>
                </div>
            </Link>
            <div className="flex flex-col gap-y-2 flex-1">
                <SidebarItem label="Learn" href="/learn" iconSrc="/duoMascot.svg" />{/*  House icon  */}
                <SidebarItem label="Leaderboard" href="/leaderboard" iconSrc="/duoMascot.svg" />{/*  medal icon  */}
                <SidebarItem label="Quests" href="/quests" iconSrc="/duoMascot.svg" />{/*  bullseye icon  */}
                <SidebarItem label="Shop" href="/shop" iconSrc="/duoMascot.svg" />{/*  bag icon  */}
            </div>
            <div className="p-4">
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <UserButton />
                </ClerkLoaded>
            </div>
        </div>
    );
};