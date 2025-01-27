---
title: "OpenLDAP & AD Integration - Centralized User Management"
description: "Migrating From Netlify to Azure: A Cloud Journey to Enhance My Blog and gain more knowledge about DevOps"
publishDate: "27 jan 2025"
tags: ["ad", "linux", "lab"]
updatedDate: 27 jan 2025
---

## Introduction

In hybrid IT environments, where Linux and Windows servers coexist, managing user authentication across platforms can pose significant challenges. A centralized authentication system ensures simplicity, security, and efficiency by synchronizing user accounts and credentials between systems. This project focuses on integrating OpenLDAP, an open-source directory service, with Windows Active Directory (AD) using Samba.

This is not a step by step guide, but a over simplified explanation of the project workings.

## Project Overview

This integration project was conducted using VMware Workstation Pro 2017 to create a controlled virtualized environment. Two virtual machines were configured:

1. Windows Server 2019: Set up as an Active Directory Domain Controller (AD DC).

2. CentOS Linux Server: Configured with OpenLDAP and Samba to synchronize user management with AD.

The objective was to synchronize user accounts and provide a streamlined authentication system across both platforms. This setup ensures that changes in user accounts are consistently reflected on both systems, reducing administrative overhead and minimizing the risk of discrepancies.

## Network Configuration

A robust network configuration was crucial to enable seamless communication between the Linux and Windows servers. Both servers were configured with the following settings:

1. Windows Server:

- IP Address: 192.168.1.10/24
- Gateway: 192.168.1.1
- DNS: 127.0.0.1

2. Linux Server:

- IP Address: 192.168.1.20/24
- Gateway: 192.168.1.1
- DNS: 192.168.1.10

## Windows Server Configuration

1. Active Directory Setup:

Installed Active Directory Domain Services (AD DS) on Windows Server 2019.

Configured the domain controller with the Fully Qualified Domain Name (FQDN) adserver.local.

Created and configured primary and reverse DNS zones to manage network name resolution. These steps included adding resource records for the Linux server. 

Example PowerShell commands:

```bash "
Add-DnsServerPrimaryZone -NetworkID "192.168.1.0/24" -ReplicationScope "Forest"
Add-DnsServerResourceRecordA -Name "openldap" -ZoneName "adserver.local" -IPv4Address "192.168.1.20"
Rename-Computer -NewName "ADSERVER" -Force
```

2. Firewall Configuration:

Configured the firewall to allow necessary traffic for LDAP, Kerberos, and DNS operations. Specific rules were added to ensure communication between AD and the OpenLDAP server.

3. User Management:

Created test user accounts in AD to verify synchronization and authentication later in the project.

## Linux Server Setup

1. System Preparation:

Installed CentOS and updated system packages to ensure compatibility and security. Required tools and libraries were installed using:

```bash "
yum install -y openldap openldap-servers openldap-clients sssd samba samba-client samba-common krb5-workstation
```
Set the hostname to align with the AD domain:
```bash "
hostnamectl set-hostname openldap.adserver.local
```

2. OpenLDAP Configuration:

Configured the OpenLDAP server (slapd). This involved:

- Generating a secure LDAP password using slappasswd and configuring slapd.conf.

- Creating a base LDAP directory structure with a custom base.ldif file.

- Starting and enabling the LDAP service:
```bash "
systemctl start slapd
systemctl enable slapd
```
- Verified LDAP functionality by adding test entries and performing queries using ldapadd and ldapsearch.

3. Kerberos Authentication:

Configured Kerberos to enable secure authentication with the AD domain. This included editing the krb5.conf file to match the domain settings and testing ticket retrieval with:
```bash "
kinit administrator@ADSERVER.LOCAL
klist
```
4. Samba Integration:

- Edited the Samba configuration file (/etc/samba/smb.conf) to enable domain integration. Key settings included specifying the realm, workgroup, and enabling Kerberos authentication.

- Modified the Name Service Switch configuration (/etc/nsswitch.conf) to include LDAP for account resolution.

- Joined the Linux server to the AD domain:
```bash "
net ads join -U administrator
```
-Verified Samba functionality using commands like:
```bash "
wbinfo -u
wbinfo -g
```
5. Testing and Validation:

- Conducted extensive testing to ensure that user accounts from AD were accessible on the Linux server. This involved:
- Querying AD users with ldapsearch.
- Authenticating users with Kerberos and testing their permissions.
- Checking Samba’s visibility of domain users and groups.

## Challenges and Alternative Solutions

Several challenges arose during the integration process, including:

- Kerberos Configuration: Ensuring accurate time synchronization between the servers to prevent Kerberos ticketing errors.

- Samba Domain Joining: Troubleshooting issues related to mismatched DNS settings and Samba’s domain join functionality.

- FreeIPA as an Alternative: While FreeIPA was initially explored as a potential solution, its additional complexity and dependencies made it less suitable for this project’s requirements.

- Early attempts to export LDAP users to AD using scripts and periodic SSH transfers were functional but inefficient, highlighting the importance of real-time synchronization solutions like Samba and OpenLDAP.

## Results

The project successfully integrated OpenLDAP with Windows Active Directory, achieving seamless synchronization and bidirectional trust. User accounts created in AD were accessible from the Linux server, and authentication requests were securely processed via Kerberos. Extensive testing confirmed the stability and reliability of the setup, ensuring that the Linux server could operate as a trusted entity within the AD domain.

## Conclusion

Integrating OpenLDAP with Windows Active Directory provides a powerful solution for centralized user management in hybrid IT environments. By leveraging OpenLDAP, Samba, and Kerberos, this project achieved unified authentication, streamlined administrative workflows, and enhanced security. For organizations managing mixed-platform networks, this approach offers a scalable and efficient method for synchronizing user accounts and simplifying authentication processes.