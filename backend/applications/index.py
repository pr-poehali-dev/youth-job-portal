import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления откликами на вакансии (job applications)
    '''
    method: str = event.get('httpMethod', 'GET')
    
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        if method == 'GET':
            # Get query parameters
            query_params = event.get('queryStringParameters') or {}
            job_id = query_params.get('job_id', '')
            user_id = query_params.get('user_id', '')
            
            print(f"Fetching applications with filters - job_id: {job_id}, user_id: {user_id}")
            
            # Build query with filters
            query = """
                SELECT id, job_id, user_id, user_name, user_email, user_phone, 
                       user_age, cover_letter, status, created_at, updated_at
                FROM t_p86122027_youth_job_portal.applications
                WHERE 1=1
            """
            
            if job_id:
                job_id_safe = str(job_id).replace("'", "''")
                query += f" AND job_id = '{job_id_safe}'"
            
            if user_id:
                user_id_safe = str(user_id).replace("'", "''")
                query += f" AND user_id = '{user_id_safe}'"
            
            query += " ORDER BY created_at DESC"
            
            cur.execute(query)
            
            rows = cur.fetchall()
            applications = []
            for row in rows:
                applications.append({
                    'id': str(row[0]),
                    'jobId': str(row[1]),
                    'userId': str(row[2]),
                    'userName': row[3],
                    'userEmail': row[4],
                    'userPhone': row[5],
                    'userAge': row[6],
                    'coverLetter': row[7],
                    'status': row[8],
                    'createdAt': row[9].isoformat() if row[9] else None,
                    'updatedAt': row[10].isoformat() if row[10] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'applications': applications}),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            job_id = str(body_data.get('job_id', '')).replace("'", "''")
            user_id = str(body_data.get('user_id', '')).replace("'", "''")
            user_name = str(body_data.get('user_name', '')).replace("'", "''")
            user_email = str(body_data.get('user_email', '')).replace("'", "''")
            user_phone = str(body_data.get('user_phone', '')).replace("'", "''")
            user_age = int(body_data.get('user_age', 0))
            cover_letter = str(body_data.get('cover_letter', '')).replace("'", "''")
            status = str(body_data.get('status', 'pending')).replace("'", "''")
            
            print(f"Creating application - user: {user_email}, job: {job_id}")
            
            # Check if user already applied to this job
            cur.execute(f"""
                SELECT id FROM t_p86122027_youth_job_portal.applications 
                WHERE job_id = '{job_id}' AND user_id = '{user_id}'
            """)
            existing = cur.fetchone()
            
            if existing:
                print(f"User {user_id} already applied to job {job_id}")
                conn.rollback()
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'You have already applied to this job'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"""
                INSERT INTO t_p86122027_youth_job_portal.applications 
                (job_id, user_id, user_name, user_email, user_phone, user_age, 
                 cover_letter, status, created_at, updated_at)
                VALUES ('{job_id}', '{user_id}', '{user_name}', '{user_email}', 
                        '{user_phone}', {user_age}, '{cover_letter}', '{status}', 
                        NOW(), NOW())
                RETURNING id, created_at
            """)
            
            result = cur.fetchone()
            application_id = result[0]
            created_at = result[1]
            conn.commit()
            
            print(f"Application created successfully with id: {application_id}")
            
            return {
                'statusCode': 201,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'id': str(application_id),
                    'jobId': job_id,
                    'userId': user_id,
                    'userName': user_name,
                    'userEmail': user_email,
                    'userPhone': user_phone,
                    'userAge': user_age,
                    'coverLetter': cover_letter,
                    'status': status,
                    'createdAt': created_at.isoformat() if created_at else None
                }),
                'isBase64Encoded': False
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            application_id = str(body_data.get('id', '')).replace("'", "''")
            status = str(body_data.get('status', '')).replace("'", "''")
            
            if not application_id or not status:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Missing required fields: id, status'}),
                    'isBase64Encoded': False
                }
            
            print(f"Updating application {application_id} status to {status}")
            
            cur.execute(f"""
                UPDATE t_p86122027_youth_job_portal.applications 
                SET status = '{status}', updated_at = NOW()
                WHERE id = '{application_id}'
                RETURNING id, job_id, user_id, user_name, user_email, user_phone, 
                          user_age, cover_letter, status, created_at, updated_at
            """)
            
            row = cur.fetchone()
            
            if not row:
                conn.rollback()
                return {
                    'statusCode': 404,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Application not found'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            application = {
                'id': str(row[0]),
                'jobId': str(row[1]),
                'userId': str(row[2]),
                'userName': row[3],
                'userEmail': row[4],
                'userPhone': row[5],
                'userAge': row[6],
                'coverLetter': row[7],
                'status': row[8],
                'createdAt': row[9].isoformat() if row[9] else None,
                'updatedAt': row[10].isoformat() if row[10] else None
            }
            
            print(f"Application {application_id} updated successfully")
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps(application),
                'isBase64Encoded': False
            }
        
        if method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            application_id = str(query_params.get('id', '')).replace("'", "''")
            
            if not application_id:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Missing required parameter: id'}),
                    'isBase64Encoded': False
                }
            
            print(f"Deleting application {application_id}")
            
            cur.execute(f"""
                DELETE FROM t_p86122027_youth_job_portal.applications 
                WHERE id = '{application_id}'
            """)
            
            deleted_count = cur.rowcount
            conn.commit()
            
            if deleted_count == 0:
                return {
                    'statusCode': 404,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Application not found'}),
                    'isBase64Encoded': False
                }
            
            print(f"Application {application_id} deleted successfully")
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'message': 'Application deleted successfully'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        if 'conn' in locals():
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
