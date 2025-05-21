// sendReminderEmail.js
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config(); // Only if you want to use environment variables

// Hardcoded email recipient
const RECIPIENT_EMAIL = "shailender.goyal06@gmail.com";

// Hardcoded user data
const userData = {
  firstName: "Shailender",
  lastName: "Goyal",
  email: RECIPIENT_EMAIL,
  lastActiveDate: "May 10, 2025",
  role: "Sales Cloud Consultant",
  team: "APAC Solutions Engineering"
};

// Hardcoded course data
const courseData = {
  title: "Salesforce Platform Fundamentals",
  progress: 65, // Percent complete
  certificate: "Salesforce Certified Administrator",
  estimatedCompletionDays: 14,
  
  // Topics that still need to be completed
  pendingTopics: [
    {
      title: "Salesforce Data Model",
      description: "Master the relationships between standard and custom objects in the Salesforce ecosystem"
    },
    {
      title: "Process Automation",
      description: "Learn to build workflows, process builders, and flow automations to streamline operations"
    },
    {
      title: "Salesforce Security Model",
      description: "Understanding profiles, permission sets, and field-level security to maintain data compliance"
    }
  ],
  
  // Topics that need revision (weak areas)
  weakTopics: [
    {
      title: "SOQL Queries",
      description: "Your assessments indicate you need more practice with complex relationship queries",
      lastAttemptDate: "April 28, 2025"
    },
    {
      title: "Apex Triggers",
      description: "Additional practice needed on optimizing bulkified triggers and understanding execution context",
      lastAttemptDate: "May 2, 2025"
    }
  ],
  
  // Recommended community resources
  communityResources: [
    {
      title: "Trailblazer Community Group: Apex Developers",
      url: "https://trailblazers.salesforce.com/apex-developers"
    },
    {
      title: "Upcoming Webinar: Salesforce Security Best Practices",
      date: "May 25, 2025",
      url: "https://salesforce.com/webinars/security-best-practices"
    }
  ]
};

// Create email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "enigmatrix37@gmail.com",
    pass: "zndw fayw fnwa twyk" // For Gmail, use App Password
  },
  logger: true, // Log to console
  debug: true // Include debug information
});

// Verify transport configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Transport verification failed:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

/**
 * Generate email content with hardcoded data
 * @returns {Object} Email subject, text and HTML content
 */
function generateEmailContent() {
  // Email subject
  const subject = `Socrates: ${userData.firstName}, continue your Salesforce learning journey!`;
  
  // Email HTML content
  const html = `
    <div style="font-family: 'Salesforce Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #032D60;">
      <div style="text-align: center; margin-bottom: 20px; background-color: #0176D3; padding: 15px; border-radius: 8px;">
        <h1 style="color: white; margin: 0;">Socrates Learning Assistant</h1>
        <p style="color: #B3E5FC; margin: 5px 0 0 0;">Your AI-powered Salesforce learning partner</p>
      </div>
      
      <p>Hello ${userData.firstName},</p>
      
      <p>We've noticed you haven't continued your <strong>${courseData.title}</strong> course since ${userData.lastActiveDate}. As a member of the ${userData.team}, completing this certification is essential for your role as a ${userData.role}.</p>
      
      <div style="background-color: #F8FBFE; border-left: 4px solid #0176D3; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">Your Progress Summary:</p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          <li>Current progress: <strong>${courseData.progress}%</strong> complete</li>
          <li>Certification track: <strong>${courseData.certificate}</strong></li>
          <li>Estimated completion: <strong>${courseData.estimatedCompletionDays} days</strong> with regular practice</li>
        </ul>
      </div>
      
      <h2 style="color: #0176D3; margin-top: 25px; border-bottom: 1px solid #B3E5FC; padding-bottom: 8px;">Topics to Complete</h2>
      <p>Our AI has identified these key areas to focus on next:</p>
      <ul style="background-color: #F8FBFE; padding: 15px 25px; border-radius: 5px;">
        ${courseData.pendingTopics.map(topic => `
          <li style="margin-bottom: 15px;">
            <strong style="color: #014486;">${topic.title}</strong>
            <p style="margin: 5px 0 0 0; color: #032D60;">${topic.description}</p>
          </li>
        `).join('')}
      </ul>
      
      <h2 style="color: #BA0517; margin-top: 30px; border-bottom: 1px solid #F5C0C5; padding-bottom: 8px;">Topics to Revisit</h2>
      <p>Based on your practice assessments, Socrates has identified areas where additional review would be beneficial:</p>
      <ul style="background-color: #FEF1F1; padding: 15px 25px; border-radius: 5px;">
        ${courseData.weakTopics.map(topic => `
          <li style="margin-bottom: 15px;">
            <strong style="color: #BA0517;">${topic.title}</strong>
            <p style="margin: 5px 0 0 0; color: #3E3E3C;">${topic.description}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #706E6B;">Last assessment: ${topic.lastAttemptDate}</p>
          </li>
        `).join('')}
      </ul>
      
      <h2 style="color: #2E844A; margin-top: 30px; border-bottom: 1px solid #91DB8B; padding-bottom: 8px;">Community Resources</h2>
      <p>Connect with the Salesforce community to enhance your learning:</p>
      <ul style="background-color: #F3FCF4; padding: 15px 25px; border-radius: 5px;">
        ${courseData.communityResources.map(resource => `
          <li style="margin-bottom: 15px;">
            <strong style="color: #2E844A;">${resource.title}</strong>
            ${resource.date ? `<p style="margin: 5px 0 0 0; font-size: 12px;">Date: ${resource.date}</p>` : ''}
            <p style="margin: 5px 0 0 0;"><a href="${resource.url}" style="color: #0176D3; text-decoration: none;">Access Resource →</a></p>
          </li>
        `).join('')}
      </ul>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="http://socrates.enigmatrix.com/learning-path/salesforce" 
           style="background-color: #0176D3; color: white; padding: 12px 25px; 
                 text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
           Resume Your Learning Path
        </a>
      </div>
      
      <p>Our adaptive AI will personalize your experience based on your learning style and progress.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #D8DDE6; font-size: 12px; color: #706E6B;">
        <p>This automated reminder was sent by Socrates, your AI learning assistant. You can adjust notification frequency in your <a href="http://socrates.enigmatrix.com/settings" style="color: #0176D3;">account settings</a>.</p>
      </div>
      
      <p>Wishing you success on your Salesforce journey,<br>The Socrates Team at Enigmatrix</p>
    </div>
  `;
  
  // Plain text version
  const text = `SOCRATES LEARNING ASSISTANT - Your AI-powered Salesforce learning partner

Hello ${userData.firstName},

We've noticed you haven't continued your ${courseData.title} course since ${userData.lastActiveDate}. As a member of the ${userData.team}, completing this certification is essential for your role as a ${userData.role}.

YOUR PROGRESS SUMMARY:
- Current progress: ${courseData.progress}% complete
- Certification track: ${courseData.certificate}
- Estimated completion: ${courseData.estimatedCompletionDays} days with regular practice

TOPICS TO COMPLETE:
${courseData.pendingTopics.map(topic => `* ${topic.title}: ${topic.description}`).join('\n')}

TOPICS TO REVISIT:
${courseData.weakTopics.map(topic => `* ${topic.title}: ${topic.description} (Last assessment: ${topic.lastAttemptDate})`).join('\n')}

COMMUNITY RESOURCES:
${courseData.communityResources.map(resource => `* ${resource.title}${resource.date ? ' - Date: ' + resource.date : ''} - URL: ${resource.url}`).join('\n')}

Resume your learning path: http://socrates.enigmatrix.com/learning-path/salesforce

Our adaptive AI will personalize your experience based on your learning style and progress.

This automated reminder was sent by Socrates, your AI learning assistant. You can adjust notification frequency in your account settings (http://socrates.enigmatrix.com/settings).

Wishing you success on your Salesforce journey,
The Socrates Team at Enigmatrix`;

  return { subject, html, text };
}

/**
 * Send reminder email with hardcoded data
 */
function sendReminderEmail() {
  console.log(`Preparing to send reminder email to ${RECIPIENT_EMAIL}...`);
  
  const emailContent = generateEmailContent();
  
  transporter.sendMail({
    from: '"Socrates Learning Assistant" <enigmatrix37@gmail.com>',
    to: RECIPIENT_EMAIL,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html
  }, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent successfully!');
      console.log('Message ID:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      console.log('Full info:', info);
    }
  });
}

// Send email immediately when script is run
sendReminderEmail();

// Uncomment to schedule a recurring reminder
/*
// Send reminder every Monday at 10 AM
cron.schedule('0 10 * * 1', () => {
  console.log('Running scheduled reminder...');
  sendReminderEmail();
});

console.log('Reminder scheduler started!');
*/
