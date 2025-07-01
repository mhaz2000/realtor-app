export type ChatInput = {
    message: string
}

export type ChatResponse = {
    description: string;
    has_units: boolean;
    unit_result: ChatUnitResult[]
}

export type ChatUnitResult = {
    link: string;
    unit_info: ChatUnitInfo; 
}

export type ChatUnitInfo = {
    completion_date: string;
    floor: number;
    full_payment: number;
    project_name: string;
    total_area: number;
    unit_code: string;
    unit_type: string;
    view: string;
}