// Maps tool names to their Clearbit-compatible domains for logo display
export const TOOL_DOMAINS: Record<string, string> = {
  'Slack': 'slack.com',
  'Zoom': 'zoom.us',
  'Loom': 'loom.com',
  'Google Meet': 'google.com',
  'Microsoft Teams': 'microsoft.com',
  'Webex': 'webex.com',
  'Asana': 'asana.com',
  'Monday.com': 'monday.com',
  'Jira': 'atlassian.com',
  'Linear': 'linear.app',
  'Trello': 'trello.com',
  'ClickUp': 'clickup.com',
  'Basecamp': 'basecamp.com',
  'Salesforce': 'salesforce.com',
  'HubSpot': 'hubspot.com',
  'Pipedrive': 'pipedrive.com',
  'Intercom': 'intercom.com',
  'Zendesk': 'zendesk.com',
  'Freshdesk': 'freshworks.com',
  'Figma': 'figma.com',
  'Miro': 'miro.com',
  'Sketch': 'sketch.com',
  'Canva': 'canva.com',
  'InVision': 'invisionapp.com',
  'Workday': 'workday.com',
  'Greenhouse': 'greenhouse.io',
  'Rippling': 'rippling.com',
  'BambooHR': 'bamboohr.com',
  'Lattice': 'lattice.com',
  'Notion': 'notion.so',
  'Confluence': 'atlassian.com',
  'Dropbox': 'dropbox.com',
  'Google Drive': 'google.com',
  'Box': 'box.com',
  'Okta': 'okta.com',
  '1Password': '1password.com',
  'Snyk': 'snyk.io',
  'Crowdstrike': 'crowdstrike.com',
  'SentinelOne': 'sentinelone.com',
  'Datadog': 'datadoghq.com',
  'Mixpanel': 'mixpanel.com',
  'Amplitude': 'amplitude.com',
  'Tableau': 'tableau.com',
  'Looker': 'looker.com',
  'Sentry': 'sentry.io',
  'New Relic': 'newrelic.com',
  'PagerDuty': 'pagerduty.com',
  'GitHub': 'github.com',
  'GitLab': 'gitlab.com',
  'Bitbucket': 'atlassian.com',
  'CircleCI': 'circleci.com',
  'AWS': 'aws.amazon.com',
  'Vercel': 'vercel.com',
  'Retool': 'retool.com',
  'Snowflake': 'snowflake.com',
  'dbt Cloud': 'getdbt.com',
  'Terraform Cloud': 'hashicorp.com',
  'DocuSign': 'docusign.com',
  'Stripe': 'stripe.com',
  'Calendly': 'calendly.com',
  'Grammarly Business': 'grammarly.com',
  'Doppler': 'doppler.com',
};

export function getToolDomain(toolName: string): string | null {
  return TOOL_DOMAINS[toolName] ?? null;
}

// Deterministic color from tool name for fallback initials
export function toolColor(name: string): string {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
    '#f97316', '#84cc16', '#06b6d4', '#a855f7',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
