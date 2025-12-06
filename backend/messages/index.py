import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для чата между работниками и работодателями (real-time messaging)
    '''
    method: str = event.get('httpMethod', 'GET')
    
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            query_params = event.get('queryStringParameters') or {}
            sender_id = query_params.get('sender_id', '')
            receiver_id = query_params.get('receiver_id', '')
            user_id = query_params.get('user_id', '')
            
            # Case 1: Get conversation between two users
            if sender_id and receiver_id:
                sender_id_safe = str(sender_id).replace("'", "''")
                receiver_id_safe = str(receiver_id).replace("'", "''")
                
                print(f"Fetching conversation between {sender_id} and {receiver_id}")
                
                cur.execute(f"""
                    SELECT id, sender_id, receiver_id, job_id, message_text, is_read, created_at
                    FROM t_p86122027_youth_job_portal.messages
                    WHERE (sender_id = '{sender_id_safe}' AND receiver_id = '{receiver_id_safe}')
                       OR (sender_id = '{receiver_id_safe}' AND receiver_id = '{sender_id_safe}')
                    ORDER BY created_at ASC
                """)
                
                rows = cur.fetchall()
                messages = []
                for row in rows:
                    messages.append({
                        'id': str(row[0]),
                        'senderId': str(row[1]),
                        'receiverId': str(row[2]),
                        'jobId': str(row[3]) if row[3] else None,
                        'messageText': row[4],
                        'isRead': row[5],
                        'createdAt': row[6].isoformat() if row[6] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'messages': messages}),
                    'isBase64Encoded': False
                }
            
            # Case 2: Get all conversations for a user (with last message)
            elif user_id:
                user_id_safe = str(user_id).replace("'", "''")
                
                print(f"Fetching all conversations for user {user_id}")
                
                cur.execute(f"""
                    WITH user_messages AS (
                        SELECT 
                            CASE 
                                WHEN sender_id = '{user_id_safe}' THEN receiver_id
                                ELSE sender_id
                            END AS other_user_id,
                            id, sender_id, receiver_id, job_id, message_text, is_read, created_at,
                            ROW_NUMBER() OVER (
                                PARTITION BY CASE 
                                    WHEN sender_id = '{user_id_safe}' THEN receiver_id
                                    ELSE sender_id
                                END 
                                ORDER BY created_at DESC
                            ) AS rn
                        FROM t_p86122027_youth_job_portal.messages
                        WHERE sender_id = '{user_id_safe}' OR receiver_id = '{user_id_safe}'
                    )
                    SELECT id, sender_id, receiver_id, job_id, message_text, is_read, created_at, other_user_id
                    FROM user_messages
                    WHERE rn = 1
                    ORDER BY created_at DESC
                """)
                
                rows = cur.fetchall()
                conversations = []
                for row in rows:
                    conversations.append({
                        'id': str(row[0]),
                        'senderId': str(row[1]),
                        'receiverId': str(row[2]),
                        'jobId': str(row[3]) if row[3] else None,
                        'messageText': row[4],
                        'isRead': row[5],
                        'createdAt': row[6].isoformat() if row[6] else None,
                        'otherUserId': str(row[7])
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'conversations': conversations}),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Missing required parameters. Provide either sender_id & receiver_id or user_id'}),
                    'isBase64Encoded': False
                }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            sender_id = str(body_data.get('sender_id', '')).replace("'", "''")
            receiver_id = str(body_data.get('receiver_id', '')).replace("'", "''")
            job_id = body_data.get('job_id', None)
            message_text = str(body_data.get('message_text', '')).replace("'", "''")
            
            if not sender_id or not receiver_id or not message_text:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Missing required fields: sender_id, receiver_id, message_text'}),
                    'isBase64Encoded': False
                }
            
            print(f"Sending message from {sender_id} to {receiver_id}")
            
            if job_id:
                job_id_safe = str(job_id).replace("'", "''")
                cur.execute(f"""
                    INSERT INTO t_p86122027_youth_job_portal.messages 
                    (sender_id, receiver_id, job_id, message_text, is_read, created_at)
                    VALUES ('{sender_id}', '{receiver_id}', '{job_id_safe}', '{message_text}', FALSE, NOW())
                    RETURNING id, created_at
                """)
            else:
                cur.execute(f"""
                    INSERT INTO t_p86122027_youth_job_portal.messages 
                    (sender_id, receiver_id, job_id, message_text, is_read, created_at)
                    VALUES ('{sender_id}', '{receiver_id}', NULL, '{message_text}', FALSE, NOW())
                    RETURNING id, created_at
                """)
            
            result = cur.fetchone()
            message_id = result[0]
            created_at = result[1]
            conn.commit()
            
            print(f"Message sent successfully with id: {message_id}")
            
            return {
                'statusCode': 201,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'id': str(message_id),
                    'senderId': sender_id,
                    'receiverId': receiver_id,
                    'jobId': job_id,
                    'messageText': message_text,
                    'isRead': False,
                    'createdAt': created_at.isoformat() if created_at else None
                }),
                'isBase64Encoded': False
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            message_id = str(body_data.get('id', '')).replace("'", "''")
            is_read = body_data.get('is_read', True)
            
            if not message_id:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Missing required field: id'}),
                    'isBase64Encoded': False
                }
            
            print(f"Marking message {message_id} as read: {is_read}")
            
            is_read_str = 'TRUE' if is_read else 'FALSE'
            
            cur.execute(f"""
                UPDATE t_p86122027_youth_job_portal.messages 
                SET is_read = {is_read_str}
                WHERE id = '{message_id}'
                RETURNING id, sender_id, receiver_id, job_id, message_text, is_read, created_at
            """)
            
            row = cur.fetchone()
            
            if not row:
                conn.rollback()
                return {
                    'statusCode': 404,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Message not found'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            message = {
                'id': str(row[0]),
                'senderId': str(row[1]),
                'receiverId': str(row[2]),
                'jobId': str(row[3]) if row[3] else None,
                'messageText': row[4],
                'isRead': row[5],
                'createdAt': row[6].isoformat() if row[6] else None
            }
            
            print(f"Message {message_id} updated successfully")
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps(message),
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
