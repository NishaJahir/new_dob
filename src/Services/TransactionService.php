<?php
/**
 * This module is used for real time processing of
 * Novalnet payment module of customers.
 * This free contribution made by request.
 * 
 * If you have found this script useful a small
 * recommendation as well as a comment on merchant form
 * would be greatly appreciated.
 *
 * @author       Novalnet AG
 * @copyright(C) Novalnet
 * All rights reserved. https://www.novalnet.de/payment-plugins/kostenlos/lizenz
 */

namespace Novalnet\Services;

use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
use Plenty\Modules\Plugin\DataBase\Contracts\Query;
use Novalnet\Models\TransactionLog;
use Plenty\Plugin\Log\Loggable;

/**
 * Class TransactionService
 *
 * @package Novalnet\Services
 */
class TransactionService
{
    use Loggable;

    /**
     * Save data in transaction table
     *
     * @param $transactionData
     */
    public function saveTransaction($transactionData)
    {
        try {
            $database = pluginApp(DataBase::class);
            $transaction = pluginApp(TransactionLog::class);
            $transaction->orderNo             = $transactionData['order_no'];
            $transaction->amount              = $transactionData['amount'];
            $transaction->callbackAmount      = $transactionData['callback_amount'];
            $transaction->referenceTid        = $transactionData['ref_tid'];
            $transaction->transactionDatetime = date('Y-m-d H:i:s');
            $transaction->tid                 = $transactionData['tid'];
            $transaction->paymentName         = $transactionData['payment_name'];
            $transaction->additionalInfo      = !empty($transactionData['additional_info']) ? $transactionData['additional_info'] : '0';
            
            $database->save($transaction);
        } catch (\Exception $e) {
            $this->getLogger(__METHOD__)->error('Callback table insert failed!.', $e);
        }
    }

    /**
     * Retrieve transaction log table data
     *
     * @param string $key
     * @param mixed  $value
     *
     * @return array
     */
    public function getTransactionData($key, $value)
    {
        $database = pluginApp(DataBase::class);
        $order    = $database->query(TransactionLog::class)->where($key, '=', $value)->get();
        return $order;
    }
    
    public function updateData($key, $value)
    {
        $database = pluginApp(DataBase::class);
        $order    = $database->query(TransactionLog::class)->where($key, '=', $value)->get();
        $this->getLogger(__METHOD__)->error('update1', $order);
        $toDo = $order[0];
        $additional_info = json_decode($toDo->additionalInfo, true);
        $this->getLogger(__METHOD__)->error('innnn', $additional_info);
        $extra_additional_info = [
            'due_date' => '2019-09-09',
            'invoice_type' => 'INVOICE',
            'invoice_account_holder' => 'Novalnet AG'
        ];
        $additional_info = array_merge($additional_info, $extra_additional_info);
        $toDo->additionalInfo = json_encode($additional_info);
        $this->getLogger(__METHOD__)->error('info1', $toDo->additionalInfo);
        $database->save($toDo);

        return $toDo;
    }
    public function updateTransactionDatas($key, $value, $due_date, $invoice_type, $invoice_account_hoder)
    {
        $database = pluginApp(DataBase::class);
        $order    = $database->query(TransactionLog::class)->where($key, '=', $value)->get();
        $update_info = $order[0];
        $additional_info = json_decode($update_info->additionalInfo, true);
        $update_additional_info = [
            'due_date' => $due_date,
            'invoice_type' => $invoice_type,
            'invoice_account_holder' => $invoice_account_hoder
        ];
        $additional_info = array_merge($additional_info, $update_additional_info);
        $update_info->additionalInfo = json_encode($additional_info);
        
        $database->save($update_info);

        return $update_info;
    }
}
