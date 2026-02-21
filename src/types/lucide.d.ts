declare module 'lucide-react' {
    import { FC, SVGProps } from 'react';
    export interface IconProps extends SVGProps<SVGSVGElement> {
        size?: string | number;
        color?: string;
        strokeWidth?: string | number;
    }
    export type Icon = FC<IconProps>;
    export const Instagram: Icon;
    export const Lock: Icon;
    export const User: Icon;
    export const Loader2: Icon;
    export const AlertCircle: Icon;
    export const Info: Icon;
    export const Users: Icon;
    export const UserMinus: Icon;
    export const UserPlus: Icon;
    export const RefreshCw: Icon;
    export const LogOut: Icon;
    export const Search: Icon;
    export const CheckCircle2: Icon;
    export const Trash2: Icon;
    export const CheckSquare: Icon;
    export const Square: Icon;
    export const ExternalLink: Icon;
    export const Check: Icon;
    export const Key: Icon;
    export const KeyRound: Icon;
}
