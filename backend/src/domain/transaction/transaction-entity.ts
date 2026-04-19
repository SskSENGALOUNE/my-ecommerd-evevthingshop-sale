
export class TransactionEntity {

    private constructor(
        public readonly id: string,
        public readonly transectionId: string,
        public readonly merchantId: string,
        public readonly orderId: string,
        public readonly merchant_name: string,
        public readonly amount: number,
        public readonly status: string,
        public readonly post_request: string,
        public readonly bank_response: string,
        public readonly bank_request: string,
        public readonly bank_type: string,
        public readonly createdAt: Date,
    ) {}

    static reconstitute(
        id: string,
        transectionId: string,
        merchantId: string,
        orderId: string,
        merchant_name: string,
        amount: number,
        status: string,
        post_request: string,
        bank_response: string,
        bank_request: string,
        bank_type: string,
        createdAt: Date,
    ): TransactionEntity {
        return new TransactionEntity(
            id,
            transectionId,
            merchantId,
            orderId,
            merchant_name,
            amount,
            status,
            post_request,
            bank_response,
            bank_request,
            bank_type,
            createdAt,
        );
    }
}