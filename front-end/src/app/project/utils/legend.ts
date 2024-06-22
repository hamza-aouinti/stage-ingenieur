export interface Legend {
    name: string;
    icon: string;
    color?: string;
    active: boolean; 
}

export const legendStatus: Legend[] = [
    {
        name: 'New',
        icon: 'label',
        color: '#26c6da',
        active: false
    },
    {
        name: 'In Progress',
        icon: 'label',
        color: '#ffb22b',
        active: false
    },
    {
        name: 'Completed',
        icon: 'label',
        color: '#009688',
        active: false
    },
];