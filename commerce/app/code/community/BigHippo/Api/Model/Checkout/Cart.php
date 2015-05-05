<?php
/**
 * Ipascual Core Api
 *
 * Sort of exposing or serving as API version of app/Mage.php file
 *
 * @category   Ipascual
 * @package    Ipascual_Customapi
 * @author     www.talosdigital.com
 */
class BigHippo_Api_Model_Checkout_Cart extends Mage_Api_Model_Resource_Abstract
{
	/**
	 *
	 * Change price to a cart product
	 * @return string
	 */
	public function updateCartProductPrice($quoteId, $productId, $price, $store = null)
	{
      $quote = Mage::getModel('sales/quote')->load($quoteId, $store);
      foreach ($quote->getAllItems() as $item) {
          if ($item->getParentItem()) {
            $item = $item->getParentItem();
          }

          $productName = $item->getProduct()->getName();
          $productPrice = $item->getProduct()->getPrice();
          if($item->getProduct()->getId() == $productId) {
            $item->setCustomPrice($price);
            $item->setOriginalCustomPrice($price);
            $item->getProduct()->setIsSuperMode(true);
            $item->save();
          }

          $quote->save();
      }
      return true;
	}

}
