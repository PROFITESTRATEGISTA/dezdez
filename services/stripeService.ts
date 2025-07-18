// Stripe integration service
// Note: This requires Stripe to be configured with environment variables

export interface StripeCustomer {
  id: string
  email: string
  name: string
  phone?: string
}

export interface StripeSubscription {
  id: string
  customer: string
  status: string
  current_period_start: number
  current_period_end: number
  items: {
    data: Array<{
      price: {
        id: string
        unit_amount: number
        currency: string
        recurring: {
          interval: string
          interval_count: number
        }
      }
    }>
  }
}

export interface StripePaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

export class StripeService {
  private static baseUrl = '/api/stripe' // This would be your backend API

  // Create customer
  static async createCustomer(customerData: {
    email: string
    name: string
    phone?: string
    metadata?: Record<string, string>
  }): Promise<StripeCustomer> {
    const response = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    })

    if (!response.ok) {
      throw new Error('Failed to create Stripe customer')
    }

    return response.json()
  }

  // Create subscription
  static async createSubscription(subscriptionData: {
    customer: string
    price_id: string
    payment_method?: string
    trial_period_days?: number
    metadata?: Record<string, string>
  }): Promise<StripeSubscription> {
    const response = await fetch(`${this.baseUrl}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    })

    if (!response.ok) {
      throw new Error('Failed to create Stripe subscription')
    }

    return response.json()
  }

  // Create payment intent for one-time payments
  static async createPaymentIntent(paymentData: {
    amount: number
    currency: string
    customer?: string
    metadata?: Record<string, string>
  }): Promise<StripePaymentIntent> {
    const response = await fetch(`${this.baseUrl}/payment-intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      throw new Error('Failed to create payment intent')
    }

    return response.json()
  }

  // Get customer
  static async getCustomer(customerId: string): Promise<StripeCustomer> {
    const response = await fetch(`${this.baseUrl}/customers/${customerId}`)

    if (!response.ok) {
      throw new Error('Failed to get Stripe customer')
    }

    return response.json()
  }

  // Get subscription
  static async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`)

    if (!response.ok) {
      throw new Error('Failed to get Stripe subscription')
    }

    return response.json()
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string): Promise<StripeSubscription> {
    const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to cancel Stripe subscription')
    }

    return response.json()
  }

  // Update subscription
  static async updateSubscription(
    subscriptionId: string,
    updates: {
      price_id?: string
      quantity?: number
      metadata?: Record<string, string>
    }
  ): Promise<StripeSubscription> {
    const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error('Failed to update Stripe subscription')
    }

    return response.json()
  }

  // Get payment methods for customer
  static async getPaymentMethods(customerId: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/customers/${customerId}/payment-methods`)

    if (!response.ok) {
      throw new Error('Failed to get payment methods')
    }

    return response.json()
  }

  // Attach payment method to customer
  static async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/payment-methods/${paymentMethodId}/attach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer: customerId }),
    })

    if (!response.ok) {
      throw new Error('Failed to attach payment method')
    }

    return response.json()
  }

  // Create setup intent for saving payment methods
  static async createSetupIntent(customerId: string): Promise<{ client_secret: string }> {
    const response = await fetch(`${this.baseUrl}/setup-intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer: customerId }),
    })

    if (!response.ok) {
      throw new Error('Failed to create setup intent')
    }

    return response.json()
  }
}

// Helper functions for Brazilian payment methods
export const BrazilianPaymentMethods = {
  // PIX payment
  createPixPayment: async (amount: number, customerEmail: string) => {
    return StripeService.createPaymentIntent({
      amount: amount * 100, // Convert to cents
      currency: 'brl',
      metadata: {
        payment_method: 'pix',
        customer_email: customerEmail,
      },
    })
  },

  // Boleto payment
  createBoletoPayment: async (amount: number, customerData: {
    email: string
    name: string
    tax_id: string
  }) => {
    return StripeService.createPaymentIntent({
      amount: amount * 100, // Convert to cents
      currency: 'brl',
      metadata: {
        payment_method: 'boleto',
        customer_email: customerData.email,
        customer_name: customerData.name,
        customer_tax_id: customerData.tax_id,
      },
    })
  },
}