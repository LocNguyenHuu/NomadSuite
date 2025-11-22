// Airtable API integration for waitlist and bug reports
// Docs: https://airtable.com/developers/web/api/introduction

interface AirtableRecord {
  fields: Record<string, any>;
}

interface AirtableResponse {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

class AirtableService {
  private baseUrl: string;
  private apiKey: string | undefined;
  
  constructor() {
    this.baseUrl = 'https://api.airtable.com/v0';
    this.apiKey = process.env.AIRTABLE_TOKEN;
  }

  private async request<T>(
    baseId: string,
    tableName: string,
    method: string,
    data?: any
  ): Promise<T> {
    if (!this.apiKey) {
      console.warn('[Airtable] No AIRTABLE_TOKEN found - skipping Airtable sync');
      return null as T;
    }

    const url = `${this.baseUrl}/${baseId}/${encodeURIComponent(tableName)}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Airtable API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async createWaitlistRecord(data: {
    name: string;
    email: string;
    country?: string;
    role: string;
    useCase?: string;
    referralCode?: string;
    emailConsent: boolean;
  }): Promise<string | null> {
    try {
      const baseId = process.env.AIRTABLE_BASE_ID;
      if (!baseId) {
        console.warn('[Airtable] No AIRTABLE_BASE_ID configured - skipping waitlist sync');
        return null;
      }
      
      const record: AirtableRecord = {
        fields: {
          'Name': data.name,
          'Email': data.email,
          'Country': data.country || '',
          'Role': data.role,
          'Use Case': data.useCase || '',
          'Referral Code': data.referralCode || '',
          'Email Consent': data.emailConsent,
          'Created At': new Date().toISOString(),
        },
      };

      const response = await this.request<{ records: AirtableResponse[] }>(
        baseId,
        'Waitlist',
        'POST',
        { records: [record] }
      );

      if (response && response.records && response.records[0]) {
        return response.records[0].id;
      }
      
      return null;
    } catch (error) {
      console.error('[Airtable] Failed to create waitlist record:', error);
      return null;
    }
  }

  async createBugReportRecord(data: {
    name?: string;
    email?: string;
    description: string;
    screenshotUrl?: string;
    contactConsent: boolean;
  }): Promise<string | null> {
    try {
      const baseId = process.env.AIRTABLE_BASE_ID;
      if (!baseId) {
        console.warn('[Airtable] No AIRTABLE_BASE_ID configured - skipping bug report sync');
        return null;
      }
      
      const fields: Record<string, any> = {
        'Name': data.name || 'Anonymous',
        'Email': data.email || '',
        'Description': data.description,
        'Contact Consent': data.contactConsent,
        'Created At': new Date().toISOString(),
      };
      
      // Handle screenshot as Airtable Attachment field
      if (data.screenshotUrl) {
        fields['Attachments'] = [
          {
            url: data.screenshotUrl
          }
        ];
      }
      
      const record: AirtableRecord = { fields };

      const response = await this.request<{ records: AirtableResponse[] }>(
        baseId,
        'Bug Reports',
        'POST',
        { records: [record] }
      );

      if (response && response.records && response.records[0]) {
        return response.records[0].id;
      }
      
      return null;
    } catch (error) {
      console.error('[Airtable] Failed to create bug report record:', error);
      return null;
    }
  }
}

export const airtableService = new AirtableService();
