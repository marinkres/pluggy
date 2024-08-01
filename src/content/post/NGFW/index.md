---
title: "NGFW - Full Lab Series on Next Generation Firewalls"
description: "Welcome to an in-depth series on network design, traffic management, and security solutions."
publishDate: "26 jul 2024"
updatedDate: 26 jul 2024
tags: ["cybersecurity", "networks", "lab", "NGFW"]
---

Welcome to an in-depth series on network design, traffic management, and security solutions. Over the coming posts, we'll be looking into a range of networking topics and practical tasks using advanced tools and technologies. This series will guide you through building and managing complex network topologies, implementing robust security measures, and optimizing network performance. Here's a sneak peek into what you can expect:

## [Designing a Network Topology with GNS3 and VMware ↪](https://marink.me/posts/topology/)
In the first part of this series, we'll focus on designing a network topology using GNS3 and VMware. You'll learn how to create a network topology that includes a central office and a branch location for your fictional company, complete with at least four different departments. The diagram will illustrate the devices, IP address schemes, and how everything connects, providing a clear and organized view of the network structure.

## [Routing ↪](https://marink.me/posts/topology/)
We'll explore Routing. Its purpose, implementation, and how it's managed with next-generation firewalls. We'll also cover administrative distance and priority, key concepts that influence the routing process. You'll gain hands-on experience configuring a firewall to manage traffic, ensuring both primary and backup internet connectivity.

## [Security Rules and NAT Mechanism ↪](https://marink.me/posts/topology/)
Understanding security rules and Network Address Translation (NAT) is crucial for any network administrator. In this segment, we'll explain what security rules are, their purpose, and how to configure them on a firewall. We’ll also discuss the NAT mechanism and its types, demonstrating how to set up rules for different departments to manage internet access and traffic.

## Fortinet Single Sign-On (FSSO) 
Discover Fortinet's Single Sign-On (FSSO) mechanism, which streamlines user authentication and enhances security. We’ll cover the components of FSSO and its advantages. You’ll implement essential services on a Windows server, configure the FSSO agent, and integrate it with FortiGate for seamless user management.

## Software-Defined WAN (SD-WAN) Management
Learn about SD-WAN and its benefits over traditional routing. We’ll delve into the criteria and mechanisms for software-defined traffic management. You'll set up two WAN links in an SD-WAN zone, create rules for link usage, and monitor performance with real-time metrics.

## Site-to-Site VPNs
VPNs are vital for secure communications between locations. We’ll explain the site-to-site VPN mechanism, its setup phases, and how to establish VPN connections between a central office and remote or partner locations. You’ll provide evidence of successful VPN configurations with logs and traceroute results.

## SSL/TLS Traffic Inspection
SSL/TLS inspection is crucial for modern firewalls to ensure secure and compliant traffic. We’ll explain how this process works and why it's important. You’ll configure an SSL inspection profile and apply it to firewall rules, demonstrating its functionality with browser-based tests.

## Web Traffic Control
Understand web traffic control mechanisms, including FortiGuard web filtering versus static URL filtering. We’ll set up web filtering rules for different departments and allow access during specific times. You’ll provide evidence of these configurations through logs and browser notifications.

## Application Control
Application control is essential for managing and securing network traffic. We’ll contrast it with web filtering and show how to configure and apply application control profiles. You’ll demonstrate its effectiveness using real-world examples.

## Antivirus Traffic Control
Learn about antivirus traffic control and its importance in network security. We’ll configure an antivirus profile and test it using EICAR test files to prove its functionality.

## Intrusion Prevention Systems and Malware Protection
Finally, we’ll cover intrusion prevention systems (IPS) and their role in modern firewalls. You’ll learn about anomalies and exploits, how to set up protection mechanisms, and conduct practical tests using various attack scenarios to validate your setup.

## Summary
Throughout this series, we’ll provide detailed explanations and practical examples, including configuration steps, evidence of successful setups, and troubleshooting tips. By the end, you'll have a solid understanding of advanced network and security concepts, equipped with the skills to manage and secure complex network environments effectively.

Stay tuned for our first post where we’ll start with designing your network topology using GNS3 & VMware and configure baseline routing and policies.