"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

type RevenueCategory = "all" | "3B+" | "1-3B" | "500M-1B" | "200-500M" | "50-200M" | "20-50M" | "<20M"

export default function CompanyTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [revenueFilter, setRevenueFilter] = useState<RevenueCategory>("all")

  const companies = [
    {
      name: "MINE SAFETY APPLIANCES CO (MSA Safety)",
      revenue: "~US$1.8 B",
      employees: "~5,100",
      offices:
        "USA: Pennsylvania – Cranberry Township (HQ), Murrysville; North Carolina – Jacksonville; California – Lake Forest | Canada: Ontario (Toronto), Alberta (Edmonton) | Ireland: Galway (plus additional global offices, ~40 total)",
      engineeringOffices:
        "Primary R&D & testing center in Cranberry Township, PA; supplementary labs in PA, NC, CA, Toronto, Edmonton, Galway",
      subsidiaries: "Subsidiaries: Sierra Monitor Systems | Status: Independent (formerly Mine Safety Appliances)",
      products:
        "Fire Safety/Rescue: SCBA; Firefighter helmets & protective apparel | Industrial Safety: Hard hats; Fall protection devices & safety harnesses | Gas Detection: Gas monitors & detectors | Other: Thermal imaging cameras; Respirators",
    },
    {
      name: "FORTUNE BRANDS INNOVATIONS, INC.",
      revenue: "~US$4.8 B",
      employees: "~11,700",
      offices:
        "USA: Illinois – Deerfield (HQ) | Global: Key offices in Europe (e.g., UK) and Asia (e.g., Japan/Singapore)",
      engineeringOffices:
        "Primary R&D center in Deerfield, IL; additional product development centers across North America and select global hubs",
      subsidiaries:
        "Divisions/Brands: Water Innovations: Moen Incorporated, House of Rohl; Outdoors: Therma‑Tru, Larson, Fiberon; Security: Master Lock, SentrySafe; Cabinetry: MasterBrand Cabinets | Status: Independent",
      products:
        "Water/Plumbing: Faucets, showers, plumbing fixtures, sinks, waste disposals | Outdoors: Entry door systems, patio decking & railing | Security: Smart locks, safes, security devices | Cabinetry: Custom and semi‑custom cabinetry",
    },
    {
      name: "TRANE COMPANY",
      revenue: "~US$3.5 B*",
      employees: "~15,000*",
      offices:
        "USA: Regional offices in states such as Illinois and Texas | Global: Offices in Europe (e.g., Germany) and Asia",
      engineeringOffices:
        "Main engineering/R&D centers in the USA (HQ region); additional centers in Europe for product localization",
      subsidiaries: "Parent: Trane Technologies (~US$12 B* revenue); Trane is a key division within Trane Technologies",
      products:
        "HVAC: Heating, ventilation & air conditioning systems; Air conditioning units; Heating systems; Building automation controls",
    },
    {
      name: "UNIVERSAL ELECTRONICS INC",
      revenue: "~US$500 M",
      employees: "~2,000",
      offices: "USA: California – Irvine (HQ); plus additional regional offices",
      engineeringOffices: "Primary R&D in Irvine, CA; additional design and testing labs in other US locations",
      subsidiaries:
        "Status: Independent | Structure: Operates under its own brand; no major separate subsidiaries identified",
      products: "Consumer Electronics/Connectivity: Remote controls; Connectivity and smart control solutions",
    },
    {
      name: "DIGITAL MONITORING PRODUCTS INC",
      revenue: "~US$50 M",
      employees: "~200",
      offices: "USA: Massachusetts – Greater Boston area (HQ)",
      engineeringOffices:
        "Dedicated engineering facility in Massachusetts specializing in sensor & monitoring technology",
      subsidiaries: "Status: Independent",
      products:
        "Monitoring & Sensors: Environmental/industrial monitoring equipment; Integrated sensor systems for industrial applications",
    },
    {
      name: "ALGO COMMUNICATIONS",
      revenue: "~US$30 M",
      employees: "~100",
      offices: "USA: California – Silicon Valley (HQ)",
      engineeringOffices: "R&D center in Silicon Valley with additional support facilities as needed",
      subsidiaries: "Status: Independent",
      products: "Communications: Radio/network equipment; Communication systems for specialized applications",
    },
    {
      name: "LENNOX INTERNATIONAL INC",
      revenue: "~US$3.0 B",
      employees: "~14,000",
      offices:
        "USA: Multiple offices nationwide (HQ in Richardson, TX) | Global: Additional offices in Canada, Europe, and Asia",
      engineeringOffices:
        "Major engineering and R&D centers in Richardson, TX; additional labs in Florida and California for product development",
      subsidiaries: "Divisions: Lennox Residential; Lennox Commercial | Status: Independent",
      products:
        "HVAC: Air conditioning systems; Furnaces, heating & cooling equipment; Integrated climate control solutions",
    },
    {
      name: "BIAMP SYSTEMS INC",
      revenue: "~US$200 M",
      employees: "~600",
      offices: "USA: California – Northridge (HQ)",
      engineeringOffices: "Primary engineering center in Northridge, CA; additional R&D facilities in the region",
      subsidiaries: "Status: Independent",
      products:
        "AV & Communication: Audio/video processing and control systems; Integrated conferencing and communication solutions",
    },
    {
      name: "CHRISTIE DIGITAL SYSTEMS",
      revenue: "~US$300 M",
      employees: "~800",
      offices: "USA: New Jersey (HQ) | Global: Key offices in Europe (e.g., UK) and Asia (e.g., Singapore)",
      engineeringOffices:
        "Primary R&D and engineering operations based in New Jersey; additional technical centers in key international markets",
      subsidiaries:
        "Status: Independent | Structure: Operates as part of the Christie brand portfolio with specialized divisions",
      products:
        "Digital Imaging & Display: Digital projectors; LED/video display systems; Video processing and control equipment",
    },
    {
      name: "MIRCOM (Mircom Group)",
      revenue: "~US$150 M",
      employees: "~500",
      offices: "USA: Northeast – Danvers, MA (HQ) | Canada: Key support office in Ontario",
      engineeringOffices:
        "Main engineering and product development center in Danvers, MA; additional technical support offices in the Northeast and in Canada",
      subsidiaries: "Structure: Operates as Mircom Group with regional service units (US & Canada)",
      products:
        "Fire & Security: Fire alarm systems; Security and detection equipment; Integrated emergency response systems",
    },
    {
      name: "EXIGENT SENSORS",
      revenue: "~US$20 M",
      employees: "~50",
      offices: "USA: Colorado region (primary office)",
      engineeringOffices: "Dedicated engineering facility in Colorado focused on sensor design and calibration",
      subsidiaries: "Status: Independent | Structure: No known subsidiaries",
      products: "Industrial Sensors & Monitoring Solutions: Industrial sensors; Monitoring solutions",
    },
    {
      name: "GECKO ALLIANCE",
      revenue: "~US$10 M",
      employees: "~30",
      offices: "USA: California (HQ)",
      engineeringOffices: "USA‑based engineering center in California",
      subsidiaries: "Status: Independent | Structure: Operates as a single entity",
      products: "Building Automation / Signage: Digital signage systems; Control systems",
    },
    {
      name: "KOHLER COMPANY",
      revenue: "~US$7 B",
      employees: "~36,000",
      offices: "USA: Multiple locations (HQ in Wisconsin) | Global: Offices worldwide",
      engineeringOffices:
        "Headquarters in Wisconsin with major R&D centers and design/development facilities nationwide",
      subsidiaries:
        "Status: Independent | Divisions/Brands: Kohler Engines – small engines, generators; Kohler Hospitality – hotel and resort management; Kohler Design Group – architectural design and innovation; Kohler Power Systems – power solutions",
      products:
        "Home & Industrial Products: Kitchen & bath products; Generators & power systems; Furniture & building products",
    },
    {
      name: "GEORGIA-PACIFIC LLC",
      revenue: "~US$20 B",
      employees: "~35,000",
      offices: "USA: Atlanta and other key offices across major U.S. states",
      engineeringOffices:
        "USA‑based engineering and R&D centers focusing on product innovation in paper, building materials, and chemicals",
      subsidiaries:
        "Parent: Koch Industries (parent revenue ~US$115 B) | Divisions: GP Packaging; GP Building Products; GP Consumer Packaging",
      products: "Building Materials & Consumer Products: Paper products; Building materials; Chemicals",
    },
    {
      name: "LSI INDUSTRIES INC",
      revenue: "~US$500 M",
      employees: "~1,000",
      offices: "USA: Regional offices in Wisconsin and surrounding areas",
      engineeringOffices:
        "USA‑based engineering center in Wisconsin with a focus on interior finishes and acoustical products",
      subsidiaries:
        "Status: Independent | Structure: Operates as an integrated company with specialized product divisions rather than separate subsidiaries",
      products: "Building Products: Interior finishes; Insulation & acoustical products",
    },
    {
      name: "LIXIL CORPORATION",
      revenue: "~US$17 B",
      employees: "~60,000",
      offices: "Japan: Tokyo (HQ) | USA: Offices across North America | Global: Offices in Europe & Asia",
      engineeringOffices:
        "Major R&D centers in Japan and the USA dedicated to sanitary ware and building materials innovation",
      subsidiaries: "Status: Independent | Divisions/Brands: INAX Corporation; American Standard Brands; and others",
      products: "Building Materials & Sanitary Ware: Windows & doors; Sanitary ware; Faucets & plumbing products",
    },
    {
      name: "WATCHFIRE SIGNS",
      revenue: "~US$50 M",
      employees: "~200",
      offices: "USA: Florida (HQ)",
      engineeringOffices:
        "USA‑based engineering facility in Florida specializing in digital signage hardware and software",
      subsidiaries: "Status: Independent | Structure: No known subsidiaries",
      products: "Digital Signage: LED display signs; Digital signage systems",
    },
    {
      name: "FRANKLIN ELECTRIC CO.",
      revenue: "~US$2 B",
      employees: "~6,000",
      offices: "USA: Wisconsin (HQ) | Global: Offices in Europe & Asia",
      engineeringOffices:
        "U.S. HQ in Wisconsin with additional R&D centers across the region for water & electrical product development",
      subsidiaries:
        "Status: Independent | Structure: Organized by product segments (e.g., water pumps, motors) rather than distinct subsidiaries",
      products: "Water & Electrical Solutions: Pumps & motors; Electrical equipment for water/wastewater treatment",
    },
    {
      name: "RHEEM MANUFACTURING COMPANY",
      revenue: "~US$6.5 B",
      employees: "~20,000",
      offices: "USA: Atlanta area (HQ) | Global: Offices in North America, Europe & Asia",
      engineeringOffices:
        "USA‑based R&D centers (notably in Atlanta) with specialized product development facilities for HVAC & appliance innovation",
      subsidiaries:
        "Status: Independent | Divisions/Brands: Ruud (a key HVAC brand); Rheem Residential and Commercial divisions (integrated internally)",
      products: "HVAC & Appliances: Air conditioners & heaters; Water heaters, refrigerators",
    },
    {
      name: "AAON",
      revenue: "~US$2 B",
      employees: "~3,000",
      offices: "USA: Texas (HQ) and key regional offices nationwide",
      engineeringOffices: "USA‑based engineering center in Texas focusing on HVAC product development and innovation",
      subsidiaries: "Status: Independent | Structure: No major separate subsidiaries",
      products: "HVAC Solutions: Heating, ventilation & air conditioning systems; Control systems",
    },
    {
      name: "INOVONICS",
      revenue: "~US$100 M",
      employees: "~500",
      offices: "USA: Indiana (HQ) & additional Midwest offices",
      engineeringOffices: "USA‑based engineering facility in Indiana focused on HVAC control systems",
      subsidiaries: "Status: Independent | Structure: Operates as a single brand",
      products: "HVAC Controls: Control systems for HVAC equipment; Temperature regulation & sensor integration",
    },
    {
      name: "ECOLAB",
      revenue: "~US$14 B",
      employees: "~50,000",
      offices: "USA: St. Paul, MN (HQ) | Global: Offices worldwide",
      engineeringOffices: "Multiple R&D centers in the USA and globally",
      subsidiaries:
        "Divisions/Brands: Global Industrial & Institutional; Global Energy Solutions; Regional Operations | Status: Independent",
      products:
        "Cleaning & Process Solutions: Cleaning chemicals; Sanitization solutions; Water treatment equipment & services",
    },
    {
      name: "STELPRO",
      revenue: "~US$100 M",
      employees: "~300",
      offices: "USA: Headquartered in Pennsylvania with regional offices",
      engineeringOffices:
        "USA‑based engineering facility in Pennsylvania specializing in HVAC sensor and control system development",
      subsidiaries: "Status: Independent | Structure: Operates solely under the STELPRO brand",
      products: "HVAC Sensors & Controls: HVAC sensors; Control systems for HVAC optimization",
    },
    {
      name: "SIGNALISATION VERMAC",
      revenue: "~US$25 M",
      employees: "~100",
      offices: "Europe/USA: Key office in France; additional presence in the USA",
      engineeringOffices: "Engineering facility in France dedicated to signal and warning device development",
      subsidiaries: "Status: Independent | Structure: No separate divisions reported",
      products: "Signaling Devices: Warning and signaling equipment for industrial safety and emergency use",
    },
    {
      name: "RESEARCH PRODUCTS (Corporation)",
      revenue: "~US$100 M",
      employees: "~400",
      offices: "USA: New Jersey (HQ) with additional offices in the Northeast",
      engineeringOffices: "USA‑based engineering center in New Jersey with dedicated labs for precision measurement",
      subsidiaries:
        "Divisions/Brands: Measurement Instruments; Sensor Solutions; Process Control Devices | Status: Independent",
      products:
        "Measurement & Sensor Solutions: Industrial measurement instruments; Sensor systems; Process control devices",
    },
    {
      name: "KMC CONTROLS",
      revenue: "~US$300 M",
      employees: "~2,000",
      offices: "USA: Offices in Minnesota and other key regions",
      engineeringOffices: "USA‑based engineering centers in Minnesota focused on building automation innovation",
      subsidiaries: "Status: Independent | Structure: Integrated operations under KMC CONTROLS brand",
      products:
        "Building Automation: Control systems for building management; Energy management & automation solutions",
    },
    {
      name: "WATTS WATER TECHNOLOGIES",
      revenue: "~US$3.5 B",
      employees: "~9,000",
      offices: "USA: North Carolina (HQ) | Global: Key offices in Europe & Asia",
      engineeringOffices: "Primary R&D center in North Carolina with additional engineering centers regionally",
      subsidiaries:
        "Divisions/Brands: Plumbing Division; Water Heating Division; Pump & Valve Division | Status: Independent",
      products:
        "Plumbing & Water Solutions: Plumbing fixtures; Water heaters, pumps & valves; Comprehensive water management systems",
    },
    {
      name: "TORNATECH",
      revenue: "~US$50 M",
      employees: "~200",
      offices: "USA: Likely Texas (HQ)",
      engineeringOffices: "USA‑based engineering center in Texas focused on industrial control solutions",
      subsidiaries: "Status: Independent | Structure: Operates as a single entity",
      products:
        "Industrial Controls: Control solutions for industrial applications; Automation and process control systems",
    },
    {
      name: "ICM",
      revenue: "~US$100 M",
      employees: "~300",
      offices: "USA: Likely Michigan (HQ)",
      engineeringOffices: "USA‑based engineering facility in Michigan specializing in building control systems",
      subsidiaries: "Status: Independent | Structure: Operates as a single brand",
      products: "Building Controls: Automation systems for building management; HVAC & energy management controls",
    },
    {
      name: "NVENT",
      revenue: "~US$2 B",
      employees: "~5,000",
      offices: "USA: Texas (HQ) | Global: Offices worldwide",
      engineeringOffices:
        "USA‑based engineering centers in Texas with additional centers globally for product development",
      subsidiaries: "Divisions/Brands: Enclosure Solutions; Power Distribution Solutions | Status: Independent",
      products: "Electrical Solutions: Electrical enclosures; Power distribution systems; Industrial control solutions",
    },
    {
      name: "MAGNETEK",
      revenue: "~US$150 M",
      employees: "~600",
      offices: "USA: Ohio area (HQ)",
      engineeringOffices: "USA‑based engineering center in Ohio dedicated to electric motor and drive design",
      subsidiaries: "Divisions: Motor Division; Drive Division (integrated within the company) | Status: Independent",
      products: "Industrial Motors & Drives: Electric motors; Variable frequency drives; Related automation products",
    },
    {
      name: "MYSA SMART THERMOSTATS",
      revenue: "~US$10 M",
      employees: "~50",
      offices: "USA: Silicon Valley (HQ)",
      engineeringOffices: "USA‑based R&D center in Silicon Valley focused on smart home technology",
      subsidiaries: "Status: Independent | Structure: Single-brand operation",
      products: "Smart Home / IoT: Smart thermostats; Home automation devices",
    },
    {
      name: "HARDING INSTRUMENTS",
      revenue: "~US$30 M",
      employees: "~150",
      offices: "USA: Likely New York area (HQ)",
      engineeringOffices: "USA‑based engineering center focused on precision measurement instruments",
      subsidiaries: "Status: Independent | Structure: Operates solely under the Harding Instruments brand",
      products: "Measurement Instruments: Precision sensors; Industrial measurement devices",
    },
    {
      name: "SMARTRISE",
      revenue: "~US$20 M",
      employees: "~100",
      offices: "USA: Likely California (HQ)",
      engineeringOffices: "USA‑based engineering facility in California dedicated to building automation R&D",
      subsidiaries: "Status: Independent | Structure: Integrated single-brand operation",
      products: "Building Automation: Control systems for building management",
    },
    {
      name: "HEAT WATCH",
      revenue: "~US$15 M",
      employees: "~75",
      offices: "USA: Likely Illinois (HQ)",
      engineeringOffices: "USA‑based engineering center in Illinois focusing on thermal control and monitoring systems",
      subsidiaries: "Status: Independent | Structure: Operates as a single entity",
      products: "Thermal Monitoring: Thermal monitoring and control systems",
    },
    {
      name: "BECS",
      revenue: "~US$10 M",
      employees: "~50",
      offices: "USA: Regional HQ (exact location not widely publicized)",
      engineeringOffices: "USA‑based engineering center for development of control systems",
      subsidiaries: "Status: Independent | Structure: Single-brand operation",
      products: "Control Systems: HVAC and industrial control solutions",
    },
    {
      name: "PARTICLE MEASURING SYSTEMS",
      revenue: "~US$25 M",
      employees: "~100",
      offices: "USA: Likely Colorado (HQ)",
      engineeringOffices: "USA‑based engineering facility in Colorado specializing in environmental monitoring",
      subsidiaries: "Status: Independent | Structure: Operates as a single brand",
      products: "Environmental Monitoring: Particulate measurement instruments; Related monitoring devices",
    },
    {
      name: "PRICE INDUSTRIES",
      revenue: "~US$100 M",
      employees: "~500",
      offices: "USA: Regional offices nationwide (HQ location not widely publicized)",
      engineeringOffices: "USA‑based engineering center focused on custom industrial product development",
      subsidiaries:
        "Divisions: Multiple business units for engineered products (integrated structure) | Status: Independent",
      products: "Custom Industrial Products: Engineered solutions for various industries",
    },
    {
      name: "NEVADA NANOTECH SYSTEMS",
      revenue: "~US$5 M",
      employees: "~20",
      offices: "USA: Nevada (HQ)",
      engineeringOffices: "USA‑based R&D center in Nevada focusing on nanotechnology applications",
      subsidiaries: "Status: Independent | Structure: Operates as a single brand",
      products: "Nanotech Sensors: Nanotechnology‑based sensor solutions",
    },
    {
      name: "POTTER ELECTRIC SIGNAL COMPANY",
      revenue: "~US$30 M",
      employees: "~200",
      offices: "USA: Likely Ohio (HQ)",
      engineeringOffices: "USA‑based engineering facility in Ohio focused on electric signaling technology",
      subsidiaries: "Status: Independent | Structure: Single-brand operation",
      products: "Electric Signaling: Electric signaling and control devices",
    },
    {
      name: "TACO COMFORT SOLUTIONS",
      revenue: "~US$500 M",
      employees: "~1,500",
      offices: "USA: Cranston, RI (HQ) | Global: Offices in Europe and Asia",
      engineeringOffices: "Cranston, RI (HQ)",
      subsidiaries:
        "Divisions: Pumps & Circulators; Hydronic Accessories; Electronic Controls; Building Automation | Status: Independent",
      products:
        "HVAC Products: Pumps and circulators; Hydronic accessories; Electronic controls; Building automation systems",
    },
    {
      name: "ELAN INDUSTRIES INC",
      revenue: "~US$50 M",
      employees: "~200",
      offices: "USA: Illinois (HQ)",
      engineeringOffices: "Illinois",
      subsidiaries: "Status: Independent | Structure: Operates as a single entity",
      products: "Electronic Controls: Custom electronic controls for HVAC and appliances",
    },
    {
      name: "STREAMLABS WATER",
      revenue: "~US$20 M",
      employees: "~100",
      offices: "USA: Atlanta, GA (HQ)",
      engineeringOffices: "Atlanta, GA",
      subsidiaries: "Parent: Rheem Manufacturing Company",
      products: "Water Monitoring: Smart water monitors; Leak detection systems",
    },
    {
      name: "INNOVASEA SYSTEMS",
      revenue: "~US$100 M",
      employees: "~400",
      offices: "USA: Boston, MA (HQ) | Global: Offices in Canada, Norway, and Vietnam",
      engineeringOffices: "Boston, MA",
      subsidiaries: "Divisions: Aquaculture Systems; Fish Tracking and Monitoring | Status: Independent",
      products: "Aquatic Solutions: Aquaculture systems; Fish tracking and monitoring technologies",
    },
    {
      name: "ACCUTROL",
      revenue: "~US$25 M",
      employees: "~150",
      offices: "USA: Monroe, CT (HQ)",
      engineeringOffices: "Monroe, CT",
      subsidiaries: "Status: Independent | Structure: Operates as a single entity",
      products: "Airflow Control: Airflow control products; Ventilation systems",
    },
    {
      name: "INTERMATIC",
      revenue: "~US$200 M",
      employees: "~1,000",
      offices: "USA: Spring Grove, IL (HQ) | Global: Offices in Mexico and Canada",
      engineeringOffices: "Spring Grove, IL",
      subsidiaries: "Divisions: Time Switches; Controls; Surge Protection | Status: Independent",
      products: "Electrical Controls: Time switches; Controls; Surge protection devices",
    },
    {
      name: "ALERT LABS",
      revenue: "~US$10 M",
      employees: "~50",
      offices: "Canada: Kitchener, ON (HQ)",
      engineeringOffices: "Kitchener, ON",
      subsidiaries: "Parent: Watsco Inc.",
      products: "Water Monitoring: Water leak detectors; Flow sensors",
    },
    {
      name: "BITSTRATA",
      revenue: "~US$5 M",
      employees: "~20",
      offices: "Canada: Vancouver, BC (HQ)",
      engineeringOffices: "Vancouver, BC",
      subsidiaries: "Status: Independent | Structure: Operates as a single entity",
      products: "IoT Solutions: IoT platforms; Data analytics solutions",
    },
    {
      name: "SOLAR TECHNOLOGY",
      revenue: "~US$50 M",
      employees: "~200",
      offices: "USA: Allentown, PA (HQ)",
      engineeringOffices: "Allentown, PA",
      subsidiaries: "Status: Independent | Structure: Operates as a single entity",
      products: "Traffic Safety Products: Solar-powered traffic signs; Message boards",
    },
    {
      name: "FLAIR",
      revenue: "~US$15 M",
      employees: "~75",
      offices: "USA: San Francisco, CA (HQ)",
      engineeringOffices: "San Francisco, CA",
      subsidiaries: "Status: Independent | Structure: Operates as a single entity",
      products: "Smart Home Products: Smart vents; Thermostats",
    },
    {
      name: "BRIGHTSIGN LLC",
      revenue: "~US$100 M",
      employees: "~500",
      offices: "USA: Los Gatos, CA (HQ)",
      engineeringOffices: "R&D and product development in California",
      subsidiaries: "Status: Independent",
      products: "Digital Signage: Media players; Digital signage solutions",
    },
    {
      name: "PLANAR SYSTEMS",
      revenue: "~US$300 M",
      employees: "~1,000",
      offices: "USA: Beaverton, OR (HQ) | Global: Offices in Europe and Asia",
      engineeringOffices: "Beaverton, OR",
      subsidiaries: "Parent: Leyard Optoelectronic (China)",
      products: "Displays & Visualization: LED video walls; Commercial displays",
    },
    {
      name: "TELKONET",
      revenue: "~US$50 M",
      employees: "~200",
      offices: "USA: Waukesha, WI (HQ)",
      engineeringOffices: "Waukesha, WI",
      subsidiaries: "Parent: VDA Group (Italy)",
      products: "Smart Energy Management: Energy-saving automation for hotels & buildings",
    },
    {
      name: "LEDSTAR",
      revenue: "~US$20 M",
      employees: "~100",
      offices: "Canada: Ontario (HQ)",
      engineeringOffices: "Ontario",
      subsidiaries: "Status: Independent",
      products: "LED Signage Solutions: LED display boards; Digital billboards",
    },
    {
      name: "EVERBRITE CORPORATION",
      revenue: "~US$150 M",
      employees: "~600",
      offices: "USA: Greenfield, WI (HQ)",
      engineeringOffices: "Greenfield, WI",
      subsidiaries: "Divisions: Everbrite Sign Division; Scoreboard & LED Display Division | Status: Independent",
      products: "Commercial Signage: Custom business signs; Digital scoreboards",
    },
    {
      name: "ABLE APPLIED TECHNOLOGIES",
      revenue: "~US$10 M",
      employees: "~50",
      offices: "USA: Likely headquartered in Texas",
      engineeringOffices: "USA-based R&D facility",
      subsidiaries: "Status: Independent",
      products: "Applied Technologies: Custom technology integration solutions",
    },
    {
      name: "LYNXSPRING",
      revenue: "~US$75 M",
      employees: "~300",
      offices: "USA: Lee's Summit, MO (HQ)",
      engineeringOffices: "Missouri",
      subsidiaries: "Status: Independent",
      products: "Building Automation: Building control & automation systems",
    },
    {
      name: "IRRIGREEN",
      revenue: "~US$15 M",
      employees: "~75",
      offices: "USA: Minnesota (HQ)",
      engineeringOffices: "Minnesota",
      subsidiaries: "Status: Independent",
      products: "Smart Irrigation: Smart water-saving irrigation systems",
    },
    {
      name: "DIGITAL CONTROL SYSTEMS INC",
      revenue: "~US$25 M",
      employees: "~100",
      offices: "USA: Likely Oregon (HQ)",
      engineeringOffices: "Oregon",
      subsidiaries: "Status: Independent",
      products: "Industrial Control Systems: Custom electronic control solutions",
    },
    {
      name: "PICA PD",
      revenue: "~US$5 M",
      employees: "~20",
      offices: "USA: Likely California (HQ)",
      engineeringOffices: "California",
      subsidiaries: "Status: Independent",
      products: "Precision Instrumentation: Precision measurement and control devices",
    },
    {
      name: "DIGITAL DESIGN CORPORATION",
      revenue: "~US$50 M",
      employees: "~200",
      offices: "USA: Headquarters likely in Illinois",
      engineeringOffices: "Illinois",
      subsidiaries: "Status: Independent",
      products: "Electronic Design Services: Custom electronic design; Embedded systems development",
    },
    {
      name: "CE ELECTRONICS",
      revenue: "~US$25 M",
      employees: "~100",
      offices: "USA: Headquarters likely in Ohio",
      engineeringOffices: "Ohio",
      subsidiaries: "Status: Independent",
      products: "Display and Control Systems: Elevator displays; Custom electronic controls",
    },
    {
      name: "SACO TECHNOLOGIES",
      revenue: "~US$100 M",
      employees: "~400",
      offices: "Canada: Montreal, QC (HQ) | Global: Offices in Europe and Middle East",
      engineeringOffices: "Montreal, QC",
      subsidiaries: "Status: Independent",
      products: "LED Lighting and Media Solutions: LED lighting systems; Media facades",
    },
    {
      name: "CRITICAL ENVIRONMENT TECHNOLOGIES",
      revenue: "~US$20 M",
      employees: "~80",
      offices: "Canada: Delta, BC (HQ)",
      engineeringOffices: "Delta, BC",
      subsidiaries: "Status: Independent",
      products: "Gas Detection Systems: Gas detectors; Indoor air quality monitors",
    },
    {
      name: "COMPUTROLS INC",
      revenue: "~US$50 M",
      employees: "~200",
      offices:
        "USA: Gretna, LA (HQ) | Regional Offices: Houston, TX; Dallas, TX; San Antonio, TX; Washington, D.C.; Southern California",
      engineeringOffices: "Gretna, LA",
      subsidiaries: "Status: Independent",
      products: "Building Automation Systems: HVAC controls; Access and lighting control systems",
    },
    {
      name: "GENESIS INTERNATIONAL",
      revenue: "~US$30 M",
      employees: "~120",
      offices: "USA: Headquarters likely in Florida",
      engineeringOffices: "Florida",
      subsidiaries: "Status: Independent",
      products: "Geospatial Solutions: GIS services; Mapping and surveying",
    },
    {
      name: "ARABLE LABS",
      revenue: "~US$15 M",
      employees: "~60",
      offices: "USA: San Francisco, CA (HQ)",
      engineeringOffices: "San Francisco, CA",
      subsidiaries: "Status: Independent",
      products: "Agricultural Monitoring: Crop and weather monitoring devices; Data analytics",
    },
    {
      name: "TROJAN TECHNOLOGIES",
      revenue: "~US$200 M",
      employees: "~800",
      offices: "Canada: London, ON (HQ) | Global: Offices in USA, Europe, and Asia",
      engineeringOffices: "London, ON",
      subsidiaries: "Parent: Danaher Corporation",
      products: "Water Treatment Solutions: UV disinfection systems; Water filtration products",
    },
    {
      name: "NANOLUMENS",
      revenue: "~US$50 M",
      employees: "~200",
      offices: "USA: Atlanta, GA (HQ)",
      engineeringOffices: "Atlanta, GA",
      subsidiaries: "Status: Independent",
      products: "LED Display Solutions: Flexible LED displays; Digital signage",
    },
    {
      name: "CALIBRATION TECHNOLOGIES",
      revenue: "~US$10 M",
      employees: "~40",
      offices: "USA: Columbia, MO (HQ)",
      engineeringOffices: "Columbia, MO",
      subsidiaries: "Status: Independent",
      products: "Gas Detection Equipment: Gas detectors; Calibration services",
    },
    {
      name: "PRICEVISION",
      revenue: "~US$15 M",
      employees: "~60",
      offices: "USA: Headquarters likely in New York",
      engineeringOffices: "New York",
      subsidiaries: "Status: Independent",
      products: "Digital Display Solutions: LED displays; Digital signage systems",
    },
    {
      name: "SECURITY FIRE ELECTRONICS",
      revenue: "~US$10 M",
      employees: "~50",
      offices: "USA: Headquarters likely in California",
      engineeringOffices: "California",
      subsidiaries: "Status: Independent",
      products: "Fire and Security Systems: Fire alarm systems; Security monitoring equipment",
    },
    {
      name: "ESP SAFETY",
      revenue: "~US$25 M",
      employees: "~100",
      offices: "USA: Headquarters likely in California",
      engineeringOffices: "California",
      subsidiaries: "Status: Independent",
      products: "Safety Equipment: Gas detectors; Flame detection systems",
    },
    {
      name: "BUILDING AUTOMATION PRODUCTS INC",
      revenue: "~US$20 M",
      employees: "~80",
      offices: "USA: Gays Mills, WI (HQ)",
      engineeringOffices: "Gays Mills, WI",
      subsidiaries: "Status: Independent",
      products: "Building Automation Sensors: Temperature sensors; Humidity sensors",
    },
    {
      name: "PASSIVE LOGIC",
      revenue: "~US$30 M",
      employees: "~120",
      offices: "USA: Salt Lake City, UT (HQ)",
      engineeringOffices: "Salt Lake City, UT",
      subsidiaries: "Status: Independent",
      products: "Autonomous Building Systems: Building automation platforms; Control systems",
    },
    {
      name: "OTO LAWN",
      revenue: "~US$5 M",
      employees: "~25",
      offices: "Canada: Headquarters likely in Ontario",
      engineeringOffices: "Ontario",
      subsidiaries: "Status: Independent",
      products: "Smart Irrigation Systems: Solar-powered smart sprinklers; Water conservation devices",
    },
    {
      name: "MONNIT",
      revenue: "~US$50 M",
      employees: "~200",
      offices: "USA: Salt Lake City, UT (HQ)",
      engineeringOffices: "Salt Lake City, UT",
      subsidiaries: "Status: Independent",
      products: "Wireless Sensors: IoT monitoring sensors; Wireless sensor networks",
    },
    {
      name: "FIKE",
      revenue: "~US$200 M",
      employees: "~800",
      offices: "USA: Blue Springs, MO (HQ) | Global: Offices in Europe and Asia",
      engineeringOffices: "Blue Springs, MO",
      subsidiaries: "Status: Independent",
      products: "Industrial Safety Solutions: Explosion protection; Fire suppression systems",
    },
    {
      name: "WHISKER",
      revenue: "~US$100 M",
      employees: "~400",
      offices: "USA: Auburn Hills, MI (HQ)",
      engineeringOffices: "Auburn Hills, MI",
      subsidiaries: "Status: Independent",
      products: "Pet Technology Products: Automated litter boxes; Pet feeders",
    },
    {
      name: "SLOAN VALVE",
      revenue: "~US$500 M",
      employees: "~1,500",
      offices: "USA: Franklin Park, IL (HQ) | Global: Offices in China and India",
      engineeringOffices: "Franklin Park, IL",
      subsidiaries: "Status: Independent",
      products: "Plumbing Products: Flush valves; Faucets; Sink systems",
    },
    {
      name: "MASCO CORPORATION",
      revenue: "~US$8 B",
      employees: "~20,000",
      offices: "USA: Livonia, MI (HQ) | Global: Operations in over 20 countries",
      engineeringOffices: "Various R&D centers globally",
      subsidiaries:
        "Subsidiaries: Behr Process Corporation; Delta Faucet Company; Hansgrohe; KraftMaid; Merillat; Milgard",
      products: "Home Improvement Products: Paints; Faucets; Cabinets; Windows",
    },
    {
      name: "ZURN",
      revenue: "~US$1 B",
      employees: "~2,500",
      offices: "USA: Milwaukee, WI (HQ)",
      engineeringOffices: "Milwaukee, WI",
      subsidiaries: "Divisions: Zurn Water Solutions; Zurn Elkay Water Solutions",
      products: "Water Solutions: Plumbing products; Water safety; Control products",
    },
    {
      name: "FIDURE",
      revenue: "~US$10 M",
      employees: "~50",
      offices: "Canada: Toronto, ON (HQ)",
      engineeringOffices: "Toronto, ON",
      subsidiaries: "Status: Independent",
      products: "Smart Water Meters: Advanced metering infrastructure for water utilities",
    },
    {
      name: "MATRIX ORBITAL",
      revenue: "~US$5 M",
      employees: "~30",
      offices: "Canada: Calgary, AB (HQ)",
      engineeringOffices: "Calgary, AB",
      subsidiaries: "Status: Independent",
      products: "Display Solutions: LCD and OLED displays; Touchscreen interfaces",
    },
    {
      name: "ARMSTRONG FLUID TECHNOLOGY",
      revenue: "~US$500 M",
      employees: "~1,200",
      offices: "Canada: Toronto, ON (HQ) | Global: Offices in USA, UK, China, India",
      engineeringOffices: "Multiple global R&D centers",
      subsidiaries: "Divisions: HVAC; Plumbing; Fire Safety",
      products: "Fluid-Flow Equipment: Pumps; Valves; Heat exchangers; Control solutions",
    },
    {
      name: "BROAN-NUTONE",
      revenue: "~US$1.5 B",
      employees: "~2,500",
      offices: "USA: Hartford, WI (HQ)",
      engineeringOffices: "Hartford, WI",
      subsidiaries: "Brands: Broan; NuTone; BEST; Venmar",
      products: "Residential Ventilation: Range hoods; Ventilation fans; Air purifiers",
    },
    {
      name: "COMPOLOGY",
      revenue: "~US$20 M",
      employees: "~80",
      offices: "USA: San Francisco, CA (HQ)",
      engineeringOffices: "San Francisco, CA",
      subsidiaries: "Status: Independent",
      products: "Waste Management Technology: Dumpster monitoring systems; Waste tracking software",
    },
    {
      name: "FORMETCO",
      revenue: "~US$50 M",
      employees: "~200",
      offices: "USA: Duluth, GA (HQ)",
      engineeringOffices: "Duluth, GA",
      subsidiaries: "Status: Independent",
      products: "Signage Solutions: LED digital billboards; Scoreboards",
    },
    {
      name: "GOJO INDUSTRIES",
      revenue: "~US$2 B",
      employees: "~2,500",
      offices: "USA: Akron, OH (HQ)",
      engineeringOffices: "Akron, OH",
      subsidiaries: "Brands: PURELL",
      products: "Sanitization Products: Hand sanitizers; Soap dispensers",
    },
    {
      name: "HALIO INC",
      revenue: "~US$15 M",
      employees: "~60",
      offices: "USA: Hayward, CA (HQ)",
      engineeringOffices: "Hayward, CA",
      subsidiaries: "Status: Independent",
      products: "Smart Glass Technology: Electrochromic glass solutions",
    },
    {
      name: "HARVEST THERMAL",
      revenue: "~US$5 M",
      employees: "~25",
      offices: "USA: Oakland, CA (HQ)",
      engineeringOffices: "Oakland, CA",
      subsidiaries: "Status: Independent",
      products: "Home Heating Solutions: Integrated heating and hot water systems",
    },
    {
      name: "SIMPLESUB WATER",
      revenue: "~US$2 M",
      employees: "~10",
      offices: "USA: Austin, TX (HQ)",
      engineeringOffices: "Austin, TX",
      subsidiaries: "Status: Independent",
      products: "Water Subscription Service: Filtered water delivery",
    },
    {
      name: "SKYLINE PRODUCTS",
      revenue: "~US$30 M",
      employees: "~120",
      offices: "USA: Colorado Springs, CO (HQ)",
      engineeringOffices: "Colorado Springs, CO",
      subsidiaries: "Status: Independent",
      products: "Price Signs and Displays: Electronic price signs; Transportation displays",
    },
    {
      name: "UPTIME SOLUTIONS",
      revenue: "~US$10 M",
      employees: "~50",
      offices: "USA: Chicago, IL (HQ)",
      engineeringOffices: "Chicago, IL",
      subsidiaries: "Status: Independent",
      products: "IT Services: Managed IT services; Network monitoring",
    },
    {
      name: "WATTIQ",
      revenue: "~US$8 M",
      employees: "~35",
      offices: "USA: Boulder, CO (HQ)",
      engineeringOffices: "Boulder, CO",
      subsidiaries: "Status: Independent",
      products: "Energy Management: IoT-based energy monitoring solutions",
    },
  ]

  // Helper function to get revenue in millions
  const getRevenueInMillions = (revenueStr, subsidiaries) => {
    // Check if there's a higher revenue mentioned in the subsidiaries/parent column
    const parentRevenueMatch = subsidiaries.match(/\$(\d+\.?\d*)(?:\s*([BM]))/)
    let highestRevenueStr = revenueStr

    if (parentRevenueMatch) {
      const parentValue = Number.parseFloat(parentRevenueMatch[1])
      const parentUnit = parentRevenueMatch[2]

      // Convert both to millions for comparison
      const parentValueInMillions = parentUnit === "B" ? parentValue * 1000 : parentValue

      const companyMatch = revenueStr.match(/\$(\d+\.?\d*)(?:\s*([BM]))/)
      if (companyMatch) {
        const companyValue = Number.parseFloat(companyMatch[1])
        const companyUnit = companyMatch[2]
        const companyValueInMillions = companyUnit === "B" ? companyValue * 1000 : companyValue

        // Use the higher value
        if (parentValueInMillions > companyValueInMillions) {
          highestRevenueStr = `~US$${parentValue} ${parentUnit}`
        }
      }
    }

    // Extract numeric value from the highest revenue string
    const match = highestRevenueStr.match(/\$(\d+\.?\d*)(?:\s*([BM]))/)
    if (!match) return 0

    const value = Number.parseFloat(match[1])
    const unit = match[2]

    // Convert to millions for comparison
    return unit === "B" ? value * 1000 : value
  }

  // Helper function to get revenue category
  const getRevenueCategory = (revenueInMillions) => {
    if (revenueInMillions >= 3000) return "3B+"
    if (revenueInMillions >= 1000) return "1-3B"
    if (revenueInMillions >= 500) return "500M-1B"
    if (revenueInMillions >= 200) return "200-500M"
    if (revenueInMillions >= 50) return "50-200M"
    if (revenueInMillions >= 20) return "20-50M"
    return "<20M"
  }

  // Get revenue color based on value
  const getRevenueColor = (revenueInMillions) => {
    if (revenueInMillions >= 3000) return "bg-red-100 text-red-800" // 3B+
    if (revenueInMillions >= 1000) return "bg-orange-100 text-orange-800" // 1-3B
    if (revenueInMillions >= 500) return "bg-yellow-100 text-yellow-800" // 500M-1B
    if (revenueInMillions >= 200) return "bg-green-100 text-green-800" // 200-500M
    if (revenueInMillions >= 50) return "bg-blue-100 text-blue-800" // 50-200M
    if (revenueInMillions >= 20) return "bg-indigo-100 text-indigo-800" // 20-50M
    return "bg-purple-100 text-purple-800" // <20M
  }

  // Filter companies based on search term and revenue category
  const filteredCompanies = companies.filter((company) => {
    // Text search filter
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.products.toLowerCase().includes(searchTerm.toLowerCase())

    // Revenue category filter
    if (revenueFilter === "all") {
      return matchesSearch
    } else {
      const revenueInMillions = getRevenueInMillions(company.revenue, company.subsidiaries)
      const category = getRevenueCategory(revenueInMillions)
      return matchesSearch && category === revenueFilter
    }
  })

  // Format text with bold sections and bullet points
  const formatText = (text, type) => {
    // Split by pipe for different sections
    const sections = text.split(" | ")

    return (
      <div className="space-y-2">
        {sections.map((section, idx) => {
          if (type === "products" || type === "subsidiaries") {
            // For products and subsidiaries, look for colon to separate header from items
            const colonIndex = section.indexOf(":")

            if (colonIndex !== -1) {
              const header = section.substring(0, colonIndex + 1)
              const items = section.substring(colonIndex + 1).split(";")

              return (
                <div key={idx}>
                  <span className="font-bold">{header}</span>
                  <ul className="list-disc pl-5 mt-1">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.trim()}</li>
                    ))}
                  </ul>
                </div>
              )
            }
          } else if (type === "offices") {
            // For offices, bold the country/region
            const parts = section.split(":")

            if (parts.length > 1) {
              return (
                <div key={idx}>
                  <span className="font-bold">{parts[0]}:</span>
                  <ul className="list-disc pl-5 mt-1">
                    {parts[1].split(";").map((location, locIdx) => (
                      <li key={locIdx}>{location.trim()}</li>
                    ))}
                  </ul>
                </div>
              )
            }
          }

          // Default case if no special formatting applies
          return <div key={idx}>{section}</div>
        })}
      </div>
    )
  }

  // Revenue category filter buttons
  const revenueCategoryFilters = [
    { label: "All", value: "all", color: "bg-gray-100 hover:bg-gray-200" },
    { label: "$3B+", value: "3B+", color: "bg-red-50 hover:bg-red-100" },
    { label: "$1-3B", value: "1-3B", color: "bg-orange-50 hover:bg-orange-100" },
    { label: "$500M-1B", value: "500M-1B", color: "bg-yellow-50 hover:bg-yellow-100" },
    { label: "$200-500M", value: "200-500M", color: "bg-green-50 hover:bg-green-100" },
    { label: "$50-200M", value: "50-200M", color: "bg-blue-50 hover:bg-blue-100" },
    { label: "$20-50M", value: "20-50M", color: "bg-indigo-50 hover:bg-indigo-100" },
    { label: "<$20M", value: "<20M", color: "bg-purple-50 hover:bg-purple-100" },
  ]

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Company Data Overview</h1>

      <div className="flex flex-col gap-4 mb-6">
        {/* Search input */}
        <div className="relative max-w-md mx-auto w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by company name or products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Revenue category filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {revenueCategoryFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={revenueFilter === filter.value ? "default" : "outline"}
              className={revenueFilter === filter.value ? "" : filter.color}
              onClick={() => setRevenueFilter(filter.value)}
              size="sm"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Est. 2024 Revenue</TableHead>
                <TableHead className="font-semibold">Employees</TableHead>
                <TableHead className="font-semibold">Major Offices</TableHead>
                <TableHead className="font-semibold">Engineering Offices</TableHead>
                <TableHead className="font-semibold">Subsidiaries / Parent</TableHead>
                <TableHead className="font-semibold">Products</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company, index) => {
                const revenueInMillions = getRevenueInMillions(company.revenue, company.subsidiaries)
                return (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRevenueColor(revenueInMillions)}`}
                      >
                        {company.revenue}
                      </span>
                    </TableCell>
                    <TableCell>{company.employees}</TableCell>
                    <TableCell className="max-w-[200px] whitespace-normal">
                      {formatText(company.offices, "offices")}
                    </TableCell>
                    <TableCell className="max-w-[200px] whitespace-normal">{company.engineeringOffices}</TableCell>
                    <TableCell className="max-w-[250px] whitespace-normal">
                      {formatText(company.subsidiaries, "subsidiaries")}
                    </TableCell>
                    <TableCell className="max-w-[250px] whitespace-normal">
                      {formatText(company.products, "products")}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-4 text-sm text-muted-foreground text-center">
        Showing {filteredCompanies.length} of {companies.length} companies
        {revenueFilter !== "all" && <span> in the {revenueFilter} revenue category</span>}
      </div>
    </div>
  )
}

