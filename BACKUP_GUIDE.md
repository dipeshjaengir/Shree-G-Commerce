# Backup & Recovery Guide

### 1. Mongoose Database Dump
Execute `mongodump` to export active database collections:
```bash
mongodump --uri="mongodb://127.0.0.1:27017/shree-g-commerce" --out="./backup"
```

### 2. Mongoose Recovery
Execute `mongorestore` to restore data:
```bash
mongorestore --uri="mongodb://127.0.0.1:27017/shree-g-commerce" "./backup/shree-g-commerce"
```
