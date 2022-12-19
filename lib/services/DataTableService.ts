import { NextApiRequest } from "next/types";

export function buildFindManyParams(req: NextApiRequest) {

    const sortAccessor = req.query.sortAccessor as string;
    const sortDirection = req.query.sortDirection as string;
    const orderByQuery = sortAccessor && sortDirection ? { [sortAccessor]: sortDirection } : undefined;
    const searchQuery = req.query.searchQuery ? JSON.parse(req.query.searchQuery as string) as object : null;

    let query: any = {}

    // Appends search terms to where clause
    if(searchQuery){
        let whereQuery: any = {};
        for(const [key, value] of Object.entries(searchQuery)){ 
            if(value !== "" && value !== null){
                whereQuery = {
                    ...whereQuery,
                    [key]: {
                        contains: value
                    }
                }
            }
        }
        query.where = whereQuery;
    }
  
    // Clone query object for use in getting total record count
    const unpaginatedQuery = {...query};

    // Pagination
    query.skip = parseInt(req.query.skip as string);
    query.take = parseInt(req.query.recordsPerPage as string);

    // Ordering
    query.orderBy = [ 
        orderByQuery
    ] as any

    return [query, unpaginatedQuery];
}

export function buildPaginatedData(req: NextApiRequest, results: Array<any>, totalRecords: Number|null|undefined)
{
    if(results.length === 0){
        return {
            data: [],
            page: 1,
            recordsPerPage: 0,
            total: 0
        }
    }

    const page = parseInt(req.query.page as string);
    const recordsPerPage = parseInt(req.query.recordsPerPage as string);

    return {
        data: results,
        page: page,
        recordsPerPage: recordsPerPage,
        total: totalRecords
    }
}

export function formatResponse<T>(data: T, total: number) {
    return {
        data: data,
        total: total
    }
}