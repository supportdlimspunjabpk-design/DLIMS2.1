-- Offices, study files, penalties and the DLIMS brief, seeded for the public site.
create table if not exists offices (
  id text primary key,
  region text not null default '',
  name text not null,
  address text not null default '',
  phone text not null default '',
  sort int not null default 0
);
create table if not exists library_items (
  id text primary key,
  kind text not null,
  title text not null,
  file_path text not null,
  note text not null default ''
);
create table if not exists penalties (
  code int primary key,
  violation text not null,
  motorcycle text not null,
  car text not null,
  cab text not null,
  other text not null
);
create table if not exists briefs (
  id text primary key,
  title text not null,
  body text not null,
  sort int not null default 0
);
insert into offices (id, region, name, address, phone, sort) values ($dlims$extra-1$dlims$, $dlims$$dlims$, $dlims$Licensing contact$dlims$, $dlims$$dlims$, $dlims$0300-6080882$dlims$, 0) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$bhakkar$dlims$, $dlims$$dlims$, $dlims$Licensing Office District Bhakkar$dlims$, $dlims$DPO Office Bhakhar$dlims$, $dlims$0300-7113347 / 04539200357$dlims$, 1) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$sahiwal-region$dlims$, $dlims$Sahiwal Region$dlims$, $dlims$Traffic Region Sahiwal$dlims$, $dlims$Traffic Region Sahiwal$dlims$, $dlims$040-9200288$dlims$, 2) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$sahiwal$dlims$, $dlims$Sahiwal Region$dlims$, $dlims$Licensing Office District Sahiwal$dlims$, $dlims$Licence Branch Sahiwal$dlims$, $dlims$040-9200366$dlims$, 3) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$okara$dlims$, $dlims$Sahiwal Region$dlims$, $dlims$Licensing Office District Okara$dlims$, $dlims$DSP Traffic District Okara$dlims$, $dlims$044-9200367$dlims$, 4) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$pakpattan$dlims$, $dlims$Sahiwal Region$dlims$, $dlims$Licensing Office District Pakpattan$dlims$, $dlims$Incharge Traffic District Pakpattan Sharif$dlims$, $dlims$0300-4455468$dlims$, 5) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$bahawalpur-region$dlims$, $dlims$Bahawalpur Region$dlims$, $dlims$Bahawalpur Region$dlims$, $dlims$District Police Lines Punjab$dlims$, $dlims$062-9250358 / 0300-4245469$dlims$, 6) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$bahawalpur$dlims$, $dlims$Bahawalpur Region$dlims$, $dlims$Licensing Office District Bahawalpur$dlims$, $dlims$District Police Lines Punjab$dlims$, $dlims$0333-4365783$dlims$, 7) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$ryk$dlims$, $dlims$Bahawalpur Region$dlims$, $dlims$Licensing Office District Rahim Yar Khan$dlims$, $dlims$DPO Office Rahimyar Khan$dlims$, $dlims$0300-4317034 / 068-5888111$dlims$, 8) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$bwn$dlims$, $dlims$Bahawalpur Region$dlims$, $dlims$Licensing Office District Bahawalnagar$dlims$, $dlims$Opposite Central Jail Bahawalnagar$dlims$, $dlims$0301-7683755 / 063-9240070$dlims$, 9) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$rwp-region$dlims$, $dlims$Rawalpindi Region$dlims$, $dlims$Rawalpindi Region$dlims$, $dlims$House No. 27/c Civil Lines near Police Lines No. 1 MT gate Rawalpindi$dlims$, $dlims$051-5110303$dlims$, 10) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$chakwal$dlims$, $dlims$Rawalpindi Region$dlims$, $dlims$Licensing Office District Chakwal$dlims$, $dlims$Near Rescue 15 Talagang Road, Chakwal$dlims$, $dlims$0543-540064$dlims$, 11) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$attock$dlims$, $dlims$Rawalpindi Region$dlims$, $dlims$Licensing Office District Attock$dlims$, $dlims$Near Record wing Artery center Chishtian Road Main Saddar Attock$dlims$, $dlims$057-9316006$dlims$, 12) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$jhelum$dlims$, $dlims$Rawalpindi Region$dlims$, $dlims$Licensing Office District Jhelum$dlims$, $dlims$Machine Mohalla Road near PS Jehlum$dlims$, $dlims$0544-9270300$dlims$, 13) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$vehari$dlims$, $dlims$Multan Region$dlims$, $dlims$Licensing Office District Vehari$dlims$, $dlims$DPO Office Vehari$dlims$, $dlims$067-3360922$dlims$, 14) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$lodhran$dlims$, $dlims$Multan Region$dlims$, $dlims$Licensing Office District Lodhran$dlims$, $dlims$DPO Office Lodhran$dlims$, $dlims$0608-9200062$dlims$, 15) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$khanewal$dlims$, $dlims$Multan Region$dlims$, $dlims$Licensing Office District Khanewal$dlims$, $dlims$DPO Office Khanewal$dlims$, $dlims$065-9200172$dlims$, 16) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$tts$dlims$, $dlims$Faisalabad Region$dlims$, $dlims$Licensing Office District Vehari$dlims$, $dlims$District Court Toba Tak Singh$dlims$, $dlims$0462518215$dlims$, 17) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$jhang$dlims$, $dlims$Faisalabad Region$dlims$, $dlims$Licensing Office District Jhang$dlims$, $dlims$Office of the DSP Traffic Jhang$dlims$, $dlims$047-9200311$dlims$, 18) on conflict do nothing;
insert into offices (id, region, name, address, phone, sort) values ($dlims$chiniot$dlims$, $dlims$Faisalabad Region$dlims$, $dlims$Licensing Office District Chiniot$dlims$, $dlims$Office of the DSP Traffic Chiniot$dlims$, $dlims$047-333366$dlims$, 19) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$mcq-moto$dlims$, $dlims$mcq$dlims$, $dlims$Motorcycle MCQs$dlims$, $dlims$/library/mcqs/motorcycle.inp$dlims$, $dlims$InPage paper for the motorcycle learner test$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$mcq-comm$dlims$, $dlims$mcq$dlims$, $dlims$Commercial vehicle MCQs$dlims$, $dlims$/library/mcqs/commercial.inp$dlims$, $dlims$InPage paper for commercial vehicles$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$mcq-gen$dlims$, $dlims$mcq$dlims$, $dlims$General MCQs$dlims$, $dlims$/library/mcqs/general.inp$dlims$, $dlims$InPage general driving licence paper$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$mcq-mech$dlims$, $dlims$mcq$dlims$, $dlims$Mechanical MCQs$dlims$, $dlims$/library/mcqs/mechanical.inp$dlims$, $dlims$InPage mechanical paper$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$sign-c$dlims$, $dlims$sign$dlims$, $dlims$Compulsory traffic signs$dlims$, $dlims$/library/signs/compulsory.jpg$dlims$, $dlims$Road signs study sheet$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$sign-i$dlims$, $dlims$sign$dlims$, $dlims$Indication traffic signs$dlims$, $dlims$/library/signs/indication.jpg$dlims$, $dlims$Road signs study sheet$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$sign-n$dlims$, $dlims$sign$dlims$, $dlims$Informative traffic signs$dlims$, $dlims$/library/signs/informative.jpg$dlims$, $dlims$Road signs study sheet$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$off-doc$dlims$, $dlims$offence$dlims$, $dlims$Offences and penalties$dlims$, $dlims$/library/offences/offences-penalties.docx$dlims$, $dlims$Twelfth Schedule, Ordinance XIX of 1965$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$form-learner$dlims$, $dlims$form$dlims$, $dlims$Learner driving permit form$dlims$, $dlims$/library/forms/learner-permit.pdf$dlims$, $dlims$PDF$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$form-intl$dlims$, $dlims$form$dlims$, $dlims$International licence form$dlims$, $dlims$/library/forms/international.doc$dlims$, $dlims$Word form$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$form-med$dlims$, $dlims$form$dlims$, $dlims$Medical form$dlims$, $dlims$/library/forms/medical.doc$dlims$, $dlims$Word form$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$form-reg$dlims$, $dlims$form$dlims$, $dlims$Regular licence form$dlims$, $dlims$/library/forms/regular.doc$dlims$, $dlims$Word form$dlims$) on conflict do nothing;
insert into library_items (id, kind, title, file_path, note) values ($dlims$form-renew$dlims$, $dlims$form$dlims$, $dlims$Renewal form$dlims$, $dlims$/library/forms/renew.doc$dlims$, $dlims$Word form$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (1, $dlims$Exceeding prescribed speed limit$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 300$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (2, $dlims$Carrying passengers in a public service vehicle exceeding permissible limit$dlims$, $dlims$-$dlims$, $dlims$-$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 300$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (3, $dlims$Violation of traffic signals (electronic or manual)$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 400$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (4, $dlims$Overloading a goods vehicle$dlims$, $dlims$-$dlims$, $dlims$-$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 400$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (5, $dlims$Driving a motor vehicle at night without proper lights$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 300$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (6, $dlims$Driving a motor vehicle on the wrong side of the road$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 300$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (7, $dlims$Driving a motor vehicle with tinted or covered glasses$dlims$, $dlims$-$dlims$, $dlims$Rs. 300 and removal of tinted glass$dlims$, $dlims$Rs. 300 and removal of tinted glass$dlims$, $dlims$Rs. 300 and removal of tinted glass$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (8, $dlims$Violation of line, lane or zebra crossing$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 200$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (9, $dlims$Plying a motor vehicle where and when prohibited$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 300$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (10, $dlims$Obstructing traffic$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 300$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (11, $dlims$Reckless and negligent driving$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 400$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (12, $dlims$Driving a motor vehicle without a driving licence$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 400$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (13, $dlims$Using a pressure horn, musical horn or any other horn in a silence zone$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 300$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (14, $dlims$Emitting excessive smoke$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 300$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (15, $dlims$Driving an unregistered motor vehicle$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 500$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (16, $dlims$Driving in violation of the age limit$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 400$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (17, $dlims$Driving a motor vehicle without a fitness certificate$dlims$, $dlims$-$dlims$, $dlims$-$dlims$, $dlims$Rs. 300 and impounding until the fitness certificate is produced$dlims$, $dlims$Rs. 400 and impounding until the fitness certificate is produced$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (18, $dlims$Driving without or in violation of the conditions of a route permit$dlims$, $dlims$-$dlims$, $dlims$-$dlims$, $dlims$Rs. 300 and impounding until the route permit is produced$dlims$, $dlims$Rs. 500 and impounding until the route permit is produced$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (19, $dlims$Riding a two-wheel motorcycle without a crash helmet$dlims$, $dlims$Rs. 100$dlims$, $dlims$-$dlims$, $dlims$-$dlims$, $dlims$-$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (20, $dlims$Pillion riding by more than two persons$dlims$, $dlims$Rs. 200$dlims$, $dlims$-$dlims$, $dlims$-$dlims$, $dlims$-$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (21, $dlims$Use of a hand-held mobile phone while driving$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 400$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (22, $dlims$Not fastening the seatbelt while driving on a notified road$dlims$, $dlims$-$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 300$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (23, $dlims$Violation of parking rules$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 300$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 300$dlims$) on conflict do nothing;
insert into penalties (code, violation, motorcycle, car, cab, other) values (24, $dlims$Violation of any other provision of the Ordinance or the rules, punishable under section 112$dlims$, $dlims$Rs. 100$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 200$dlims$, $dlims$Rs. 300$dlims$) on conflict do nothing;
insert into briefs (id, title, body, sort) values ($dlims$features$dlims$, $dlims$Main features$dlims$, $dlims$DRIVING LICENCE ISSUANCE MANAGEMENT SYSTEM — MTMIS

Main features of DLIMS

Revalidating existing licence holders
• Identifying and revalidating vehicle users and entities of questionable origin
• Maintaining a correct and updated database

Facilitating security
• Checking and controlling driving licence forgery
• Tracking and on-the-spot verification of a licence

Enhancing revenue
• Monitoring traffic-violation revenue accurately
• Automation widens the revenue base

A hub for other agencies through the website
• CRO, vehicle fitness, security and reduction of road accidents
• Route-permit taxation, traffic engineering, economic planning and future transport planning
• Providing the licence ID for the taxation system and related databases: MVR–MTMIS, CRO–MTMIS, TDAS–MTMIS and the data warehouse

Problems this system is meant to close
• Cumbersome procedures
• Revenue loss and non-reconciliation
• Weak features for effective policing
• Weak features against forgery and tampering
• Unreliable statistics for dependent user groups
• A passive or limited role as a data provider

Performance this system is meant to raise
• Driving licence issuance automation
• Efficient collection of revenue through the ticketing system
• A centralised licensing database for the whole of Punjab
• Control of vehicle-related crime$dlims$, 1) on conflict do nothing;
insert into briefs (id, title, body, sort) values ($dlims$objectives$dlims$, $dlims$Main objectives$dlims$, $dlims$Main objectives

DLIMS is a database hub for driving licences and the challan ticketing system. It gives concerned officials real-time access so action can be taken in time. It is built in modules, so a module can be added or removed when the need changes.

Modules
• Issuance and management of driving licences
• Automating the whole chain up to a driving licence
• Delivery of issued licences to the applicant’s doorstep, and verification of the applicant on that basis
• Issuance and management of the challan ticketing system
• Raising driving literacy and issuance of learner permits
• Automation of driving tests so the licence goes to the candidate who qualifies
• Renewal of any type of licence from anywhere in the province

The system provides the maximum practical automated interface for these functions.

Datacentre
A main data centre for the driving licence offices of Punjab is planned at Police Qurban Lines, Lahore.$dlims$, 2) on conflict do nothing;
insert into briefs (id, title, body, sort) values ($dlims$status$dlims$, $dlims$Project status$dlims$, $dlims$Project status (record supplied with this portal)

On completion, Traffic Police Punjab can issue a public-friendly, modern, IT-based secure driving licence card generated through the DLIMS application. Renovation of licensing branches in 25 districts of Punjab was reported complete. Hardware for Lahore, Faisalabad, Gujranwala and Sahiwal was procured by the Punjab Information Technology Board, and installation was reported complete. Online connectivity for those four districts, and the software contract, were planned in financial year 2012–2013.

Those four districts were to be inaugurated first. The remaining districts of Punjab were to follow as the budget was released.

A second revised PC-I was approved by the Inspector General of Police, Punjab, at a revised cost of Rs. 191.607 million, with the gestation period extended to 31 December 2013.

A noted bottleneck was a summary for an additional Rs. 250 per licence:
• Online verification by NADRA — Rs. 30
• Printing — Rs. 125
• Delivery / courier — Rs. 25
• Revolving fund, used with the permission of the Revolving Fund Management Committee — Rs. 70

That summary was sent to Police Headquarters, Punjab, for the Chief Minister. A committee met on 24 December 2012 at 7-Club, CM Secretariat, Lahore. The chair agreed to raise the operational charge by Rs. 70 over and above the revenue stamp duty. A summary was sent to the Home Department vide letter No. 13/HQrs/F-I dated 21.02.2013.

Rs. 20.00 million was released by the Planning and Development Department for further implementation. Those funds were recorded as not sufficient to finish the project by the target date.$dlims$, 3) on conflict do nothing;
