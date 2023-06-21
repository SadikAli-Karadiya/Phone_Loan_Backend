const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const formidable = require("formidable")
const { transaction, emi, receipt , purchase , customer , phone , company , installment} = require("../../../models")


// // 1 . Add Transaction
const AddTransaction = async (req, res, next) => {
    try {

        const PayEMI = await emi.update(
            {
                paid_date: req.body.paid_date,
                status: req.body.status,
            },
            {
                where: {
                    id: req.body.purchase_id
                }
            }
        );

        const EMI = await emi.findOne(
            {
                where: {
                    id: req.body.purchase_id
                }
            }
        );

        const Receipt = await receipt.create(
            {
                emi_id: EMI.id,
                admin_id: "1",
                extra_charge: ""
            }
        );

        const data = await transaction.create({
            receipt_id: Receipt.id,
            is_by_cheque: req.body.is_by_cheque,
            is_by_cash: req.body.is_by_cash,
            is_by_upi: req.body.is_by_upi,
            cheque_no: req.body.chequeNo,
            cheque_date: req.body.chequeDate,
            upi_no: req.body.upi_number,
            amount: req.body.amount
        });

        console.log(data)

        res.status(201).json({
            data: data,
            success: true,
            message: "Purchase added successfully",
        });
    } catch (error) {
        next(error)
    }
}


// // 2 . Get all Transaction
const getallTransaction = catchAsyncErrors(async (req, res, next) => {
    let page = req.params.pageNo
    const itemsPerPage = 10
    const today = new Date();
    console.log(today)
    const AllTransaction = await transaction.findAll({
        skip: page * itemsPerPage,
        take: itemsPerPage,
        where: {
            createdAt: today
        }
    })

    const totaltransection = await transaction.count();

    res.status(200).json({
        AllTransaction: AllTransaction,
        pageCount: Math.ceil(totaltransection / itemsPerPage),
        success: true,
        message: "All Transaction"
    })
})

// // 3 . Get Single Transaction
const getSingleTransaction = catchAsyncErrors(async (req, res, next) => {

    const { id } = req.params

    const SingleTransaction = await transaction.findOne({
        where: {
            id: Number(id)
        }
    })

    res.status(200).json({
        SingleTransaction: SingleTransaction,
        success: true,
        message: "One Transaction Details"
    })
})

// // 3 . Get Single Transaction By Receipt ID
const getSingleTransactionByReceiptId = catchAsyncErrors(async (req, res, next) => {

    const { id } = req.params

    const SingleTransaction = await transaction.findOne({
        where: {
            receipt_id: Number(id)
        },
        include: [
            {
                model: receipt,
                include: [{
                    model: emi,
                    include: [{
                        model: purchase,
                        include: [customer, installment, {
                            model: phone,
                            include: [
                                company
                            ]
                        }]
                    }]
                }]
            }
        ]
    })

    res.status(200).json({
        SingleTransaction: SingleTransaction,
        success: true,
        message: "One Transaction Details"
    })
})

// // 4 . Update Transaction
const updateTransation = catchAsyncErrors(async (req, res, next) => {

    const { id } = req.params

    const updateTransactionDetails = await transaction.update(req.body, {
        where: {
            id: Number(id)
        },
    })

    res.status(200).json({
        updateTransactionDetails: updateTransactionDetails,
        success: true,
        message: "Transaction details updated"
    })
})

// // 5 . Delete Transaction
const deleteTransactionDetails = catchAsyncErrors(async (req, res, next) => {

    const { id } = req.params

    const DeleteTransactionDetails = await transaction.destroy({
        where: {
            id: Number(id)
        }
    })

    res.status(200).json({
        DeleteTransactionDetails: DeleteTransactionDetails,
        success: true,
        message: "Transaction deleted successfully"
    })

})



module.exports = {
    AddTransaction,
    getallTransaction,
    getSingleTransaction,
    updateTransation,
    deleteTransactionDetails,
    getSingleTransactionByReceiptId
};
