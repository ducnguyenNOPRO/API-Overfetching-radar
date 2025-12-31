type EndpointReport = {
    used: string[];   // used fields (paths)
    unused: string[];  //  unused fields (paths)
    total: number;  // total of unique fields for this endpoint
    overfetchRatio: number;  // unused / total * 100
}

type Summary = {
    totalNormalizedEndpoints: number;   // total unique normalized endpoints observed
    totalFields: number;   // Same requested field from different normalized endpoints also counted
    totalUnusedFields: number;   // Fields that are not used in page
    overfetchRatio: number;  //  unusedFields / totalFields * 100
}

type Report = {
    summary: Summary,
    endpoints: Record<
        string,   // endpoints
        EndpointReport
    >
}

export type { Report, Summary, EndpointReport };