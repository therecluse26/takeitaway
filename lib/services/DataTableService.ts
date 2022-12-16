import { NextApiRequest } from "next/types";

export function buildFindManyParams(req: NextApiRequest) {

    const sortAccessor = req.query.sortAccessor as string;
    const sortDirection = req.query.sortDirection as string;
    const orderByQuery = sortAccessor && sortDirection ? { [sortAccessor]: sortDirection } : undefined;
  
    let query: any = {
        skip: 1,
        take: parseInt(req.query.recordsPerPage as string),
        orderBy: [ 
            orderByQuery
        ] as any
    }

    const cursor = (req.query.cursor ? { id: req.query.cursor } : null) as any;

    if(cursor){
        query.cursor = cursor;
    }
    return query;

}

export function buildPaginatedData(results: Array<any>, req: NextApiRequest, totalRecords: Number|null|undefined)
{
    if(results.length === 0){
        return {
            data: [],
            cursor: null,
            page: 1,
            recordsPerPage: 0,
            total: 0
        }
    }

    const page = parseInt(req.query.page as string);
    const recordsPerPage = parseInt(req.query.recordsPerPage as string);
    const cursor = results[results.length - 1].id;

    return {
        data: results,
        cursor: cursor,
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