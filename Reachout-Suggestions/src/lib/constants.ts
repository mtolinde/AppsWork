export const SITE_NAME = 'Excel Processor'
export const SITE_DESCRIPTION = 'Process Excel files with ease'

export const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export const EXCEL_FILE_TYPES = '.xlsx, .xls'

export const EXPECTED_SHEETS = ['PPM Accel', 'Alerts', 'PPM', 'Step 6', 'Territory Lookback']

export const SHEET_STRUCTURES = {
  'PPM Accel': ['Account', 'EE', 'SBE', 'SBE1', 'SBE2', 'MyPPM Projects', 'AA Projects %ID', 'ID Delta', 'MyPPM Projects %Convert', 'AA Project %WIN', 'Convert Delta', 'AA Device %WIN', 'MyPPM Projects Value', '# AA PPM Projects'],
  'Alerts': ['Alert Description', 'Account Name', 'Activity Date', 'Contact Email', 'GPN', 'Detail', 'Detail Link', 'Last Email Date', 'Last Email Description', 'PPM Project List', 'Contact Name', 'Alert Contact Email List'],
  'PPM': ['Account Name', 'Project Name', 'SOP QTR', 'GPN', 'Convert Pipeline (SOP)', 'Stuck Convert', 'Convert to Revenue', 'Account GPN Popularity', 'mmPPM Convert', 'Convert (30 days)', 'Contact Name List', '$ Amt Identified', '% $ Amt Converted'],
  'Step 6': ['Sub Family', 'GPN', 'SBE', 'SBE-1', 'SBE-2', 'My Account', '2022 QTY', '2022 R', '2023 QTY', '2023 R', '2024 QTY', '2024 R', '2025 QTY', '2025 R'],
  'Territory Lookback': ['Activity Date', 'MAA Name', 'Contact Name', 'Email', 'GPN', 'Activity Type', 'Product Family', 'Derived Entity', 'QTY', 'GPN Release Date', 'Playbook Division Name', 'Company Name', 'VIP', 'Contact Lookback URL', 'Account Lookback URL', 'TI.com URL', 'Content Recommender Link', 'Sub Family TICOM', 'New GPN Flag', 'New Sub Family Flag', 'Market Level 2', 'Market Level 3', 'Market Level 4', 'Market Segment of MAA Name', 'Sector of MAA Name', 'EE Category of MAA Name', 'End Equipment of MAA Name', 'EE Variant of MAA Name', 'Phone', 'Postal Code', 'CITY', 'STATE', 'COUNTRY', 'Requester Email', 'GPN on Project Flag', 'Contact on Project', 'Active Project List', 'Marketing Email Opt-Out Status', 'MG1', 'SBE', 'SBE-1', 'SBE-2', 'Product Category', 'GPN Marketing Status', 'Sub Family Lowest', 'Rating', 'Description']
}

export const ACCOUNT_COLUMNS = {
  'PPM Accel': 'Account',
  'Alerts': 'Account Name',
  'PPM': 'Account Name',
  'Step 6': 'My Account',
  'Territory Lookback': 'MAA Name'
}

export const PERCENTAGE_COLUMNS = ['AA Projects %ID', 'MyPPM Projects %Convert', 'AA Project %WIN', 'AA Device %WIN']