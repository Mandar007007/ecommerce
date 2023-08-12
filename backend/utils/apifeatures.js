class Apifeatures{
    constructor(query,queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        }: {}

        this.query = this.query.find({...keyword})
        
        return this
    }

    filter(){
        const queryCopy = {...this.queryStr}

        //Removing some fields from category

        const removeFields = ["keyword","page","limit"]

        removeFields.forEach(data => delete queryCopy[data])

        //Filters for price and Ratings

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key) => `$${key}`);


        this.query = this.query.find(JSON.parse(queryStr));

        return this
    }

    pagination(pages){
        const currentPage = this.queryStr.page || 1;
        const skip = pages * (currentPage - 1)

        this.query = this.query.limit(pages).skip(skip)

        return this
    }
}

module.exports = Apifeatures