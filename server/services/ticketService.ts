import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store ticket data
const TICKETS_FILE = path.join(process.cwd(), 'tickets.json');

export interface Ticket {
  ticketNumber: number;
  commerceOrder: string;
  email: string;
  payerName: string;
  rut?: string;
  phone?: string;
  purchaseDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  flowOrder?: number;
}

export interface TicketData {
  nextTicketNumber: number;
  maxTickets: number;
  tickets: Ticket[];
}

export class TicketService {
  private data: TicketData | null = null;
  private readonly MAX_TICKETS = 10000;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize ticket data from file or create new
   */
  private async initialize() {
    try {
      const fileContent = await fs.readFile(TICKETS_FILE, 'utf-8');
      this.data = JSON.parse(fileContent);
      console.log('✅ Tickets data loaded:', {
        nextTicketNumber: this.data?.nextTicketNumber,
        totalSold: this.data?.tickets.length,
        maxTickets: this.data?.maxTickets
      });
    } catch (error) {
      // File doesn't exist, create initial data
      console.log('📝 Creating new tickets file');
      this.data = {
        nextTicketNumber: 1,
        maxTickets: this.MAX_TICKETS,
        tickets: []
      };
      await this.save();
    }
  }

  /**
   * Save ticket data to file
   */
  private async save() {
    if (!this.data) return;

    try {
      await fs.writeFile(TICKETS_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
      console.log('💾 Tickets data saved successfully');
    } catch (error) {
      console.error('❌ Error saving tickets data:', error);
      throw new Error('Failed to save ticket data');
    }
  }

  /**
   * Get available tickets count
   */
  async getAvailableTicketsCount(): Promise<number> {
    if (!this.data) await this.initialize();
    return this.MAX_TICKETS - (this.data?.tickets.length || 0);
  }

  /**
   * Check if tickets are available
   */
  async areTicketsAvailable(): Promise<boolean> {
    const available = await this.getAvailableTicketsCount();
    return available > 0;
  }

  /**
   * Reserve a ticket number
   */
  async reserveTicket(params: {
    commerceOrder: string;
    email: string;
    payerName: string;
    rut?: string;
    phone?: string;
    flowOrder?: number;
  }): Promise<Ticket> {
    if (!this.data) await this.initialize();

    // Check if tickets are available
    if (!(await this.areTicketsAvailable())) {
      throw new Error('No hay más tickets disponibles. Máximo 10,000 tickets alcanzado.');
    }

    // Create ticket
    const ticket: Ticket = {
      ticketNumber: this.data!.nextTicketNumber,
      commerceOrder: params.commerceOrder,
      email: params.email,
      payerName: params.payerName,
      rut: params.rut,
      phone: params.phone,
      flowOrder: params.flowOrder,
      purchaseDate: new Date().toISOString(),
      status: 'pending'
    };

    // Increment next ticket number
    this.data!.nextTicketNumber++;

    // Add ticket to array
    this.data!.tickets.push(ticket);

    // Save to file
    await this.save();

    console.log(`🎫 Ticket ${ticket.ticketNumber} reserved for ${params.email}`);

    return ticket;
  }

  /**
   * Confirm a ticket after successful payment
   */
  async confirmTicket(commerceOrder: string, flowOrder?: number): Promise<Ticket | null> {
    if (!this.data) await this.initialize();

    const ticket = this.data?.tickets.find(t => t.commerceOrder === commerceOrder);

    if (!ticket) {
      console.error(`❌ Ticket not found for order: ${commerceOrder}`);
      return null;
    }

    ticket.status = 'confirmed';
    if (flowOrder) {
      ticket.flowOrder = flowOrder;
    }

    await this.save();

    console.log(`✅ Ticket ${ticket.ticketNumber} confirmed for order ${commerceOrder}`);

    return ticket;
  }

  /**
   * Cancel a ticket
   */
  async cancelTicket(commerceOrder: string): Promise<void> {
    if (!this.data) await this.initialize();

    const ticket = this.data?.tickets.find(t => t.commerceOrder === commerceOrder);

    if (!ticket) {
      console.error(`❌ Ticket not found for order: ${commerceOrder}`);
      return;
    }

    ticket.status = 'cancelled';
    await this.save();

    console.log(`❌ Ticket ${ticket.ticketNumber} cancelled for order ${commerceOrder}`);
  }

  /**
   * Get ticket by commerce order
   */
  async getTicketByOrder(commerceOrder: string): Promise<Ticket | null> {
    if (!this.data) await this.initialize();

    return this.data?.tickets.find(t => t.commerceOrder === commerceOrder) || null;
  }

  /**
   * Get ticket by email
   */
  async getTicketsByEmail(email: string): Promise<Ticket[]> {
    if (!this.data) await this.initialize();

    return this.data?.tickets.filter(t => t.email === email) || [];
  }

  /**
   * Get statistics
   */
  async getStats() {
    if (!this.data) await this.initialize();

    const confirmed = this.data?.tickets.filter(t => t.status === 'confirmed').length || 0;
    const pending = this.data?.tickets.filter(t => t.status === 'pending').length || 0;
    const cancelled = this.data?.tickets.filter(t => t.status === 'cancelled').length || 0;

    return {
      totalTickets: this.data?.tickets.length || 0,
      confirmed,
      pending,
      cancelled,
      available: await this.getAvailableTicketsCount(),
      maxTickets: this.MAX_TICKETS,
      nextTicketNumber: this.data?.nextTicketNumber || 1
    };
  }
}
