from django.test import TestCase
from .models import User

class UserModelTest(TestCase):
    def test_user_creation(self):
        user = User.objects.create_user(
            username='testuser',
            email='user@test.com',
            password='pass',
            name='Test',
            last_name='User'
        )
        self.assertIsInstance(user, User)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'user@test.com')
        self.assertEqual(user.name, 'Test')
        self.assertEqual(user.last_name, 'User')
        self.assertTrue(user.check_password('pass'))
