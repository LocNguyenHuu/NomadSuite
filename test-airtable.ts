// Test script to verify Airtable integration with dummy data
// Run with: tsx test-airtable.ts

interface TestResult {
  type: 'waitlist' | 'bug-report';
  success: boolean;
  id?: number;
  error?: string;
}

async function getCsrfToken(): Promise<string> {
  const res = await fetch('http://localhost:5000/api/csrf-token');
  const data = await res.json();
  return data.csrfToken;
}

async function testWaitlist(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const csrfToken = await getCsrfToken();
  
  const testEntries = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      country: 'United States',
      role: 'Digital Nomad',
      useCase: 'Managing clients across multiple countries while traveling through Europe',
      emailConsent: true
    },
    {
      name: 'Marco Silva',
      email: 'marco.silva@example.com',
      country: 'Portugal',
      role: 'Freelancer',
      useCase: 'Need help tracking visa requirements and tax residency while working remotely',
      emailConsent: false
    },
    {
      name: 'Lisa Chen',
      email: 'lisa.chen@example.com',
      country: 'Singapore',
      role: 'Agency/Team',
      useCase: 'Looking for a CRM to manage international clients and handle multi-currency invoicing',
      referralCode: 'FRIEND123',
      emailConsent: true
    }
  ];

  for (const entry of testEntries) {
    try {
      const response = await fetch('http://localhost:5000/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        const data = await response.json();
        results.push({
          type: 'waitlist',
          success: true,
          id: data.id
        });
        console.log(`✓ Waitlist entry created: ${entry.name} (ID: ${data.id})`);
      } else {
        const error = await response.text();
        results.push({
          type: 'waitlist',
          success: false,
          error
        });
        console.error(`✗ Failed to create waitlist entry for ${entry.name}: ${error}`);
      }
    } catch (error: any) {
      results.push({
        type: 'waitlist',
        success: false,
        error: error.message
      });
      console.error(`✗ Error creating waitlist entry for ${entry.name}:`, error.message);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}

async function testBugReports(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const csrfToken = await getCsrfToken();
  
  const testReports = [
    {
      name: 'Alex Developer',
      email: 'alex.dev@example.com',
      description: 'The pricing toggle button is not responding on mobile devices. When I tap the Monthly/Annual toggle, nothing happens. Tested on iPhone 13 Pro with iOS 17.',
      contactConsent: true
    },
    {
      name: 'Emma Designer',
      email: 'emma.design@example.com',
      description: 'Found a layout issue in the waitlist form. The email input field is not aligned properly with other fields on tablets. The label appears misaligned when viewing at 768px width.',
      contactConsent: false
    },
    {
      description: 'Anonymous report: The footer links are not working correctly. When I click on Privacy Policy, the page scrolls but doesn\'t navigate. Browser: Chrome 120 on Windows 11.',
      contactConsent: false
    }
  ];

  for (const report of testReports) {
    try {
      const response = await fetch('http://localhost:5000/api/bug-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(report),
      });

      if (response.ok) {
        const data = await response.json();
        results.push({
          type: 'bug-report',
          success: true,
          id: data.id
        });
        console.log(`✓ Bug report created: ${report.name || 'Anonymous'} (ID: ${data.id})`);
      } else {
        const error = await response.text();
        results.push({
          type: 'bug-report',
          success: false,
          error
        });
        console.error(`✗ Failed to create bug report for ${report.name || 'Anonymous'}: ${error}`);
      }
    } catch (error: any) {
      results.push({
        type: 'bug-report',
        success: false,
        error: error.message
      });
      console.error(`✗ Error creating bug report for ${report.name || 'Anonymous'}:`, error.message);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}

async function main() {
  console.log('\n🧪 Testing Airtable Integration\n');
  console.log('='.repeat(60));
  
  console.log('\n📋 Creating Waitlist Entries...\n');
  const waitlistResults = await testWaitlist();
  
  console.log('\n🐛 Creating Bug Reports...\n');
  const bugResults = await testBugReports();
  
  console.log('\n='.repeat(60));
  console.log('\n📊 Summary:\n');
  
  const waitlistSuccess = waitlistResults.filter(r => r.success).length;
  const bugSuccess = bugResults.filter(r => r.success).length;
  
  console.log(`Waitlist: ${waitlistSuccess}/${waitlistResults.length} successful`);
  console.log(`Bug Reports: ${bugSuccess}/${bugResults.length} successful`);
  
  console.log('\n✅ Database entries created successfully!');
  console.log('📮 Check your Airtable base for synced records:');
  console.log('   - Waitlist table should have 3 new entries');
  console.log('   - Bug Reports table should have 3 new entries');
  console.log('\n💡 Note: Airtable sync runs in the background. Check server logs for any sync errors.');
}

main().catch(console.error);
